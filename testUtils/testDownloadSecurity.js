const request = require("supertest");
const nock = require("nock");
const url = require('url');
const path = require('path');

/**
 * Reusable security test suite for Express file download routers.
 *
 * This utility runs a set of standardized security tests to verify that a download endpoint:
 *   - Only allows downloads from a whitelisted domain
 *   - Blocks redirect-based whitelist bypass attempts
 *   - Blocks direct access to non-whitelisted domains
 *   - Blocks redirects from whitelisted domains to malicious domains
 *
 * Usage:
 *   testDownloadSecurity(() => app, {
 *     route: "/download",
 *     allowedUrl: "https://cdn.example.com/file.txt",
 *     bypassPayload: "https://cdn.example.com@302.r3dir.me/--to/?url=https://evil.com/file.txt",
 *     externalUrl: "https://evil.com/file.txt",
 *     cdnCloudfront: "https://cdn.example.com"
 *   });
 *
 * @param {Function} getApp - Function returning a fresh Express app instance with the router mounted
 * @param {Object} params
 * @param {string} params.route - The endpoint path to test
 * @param {string} params.allowedUrl - A valid file URL from the whitelisted CDN (should succeed)
 * @param {string} params.bypassPayload - A crafted redirect payload (should be blocked)
 * @param {string} params.externalUrl - A non-whitelisted domain (should be blocked)
 * @param {string} params.cdnCloudfront - The CDN domain for nock mocking
 */
function testDownloadSecurity(getApp, { route, allowedUrl, bypassPayload, externalUrl, cdnCloudfront }) {
  const parsedUrl = url.parse(allowedUrl);
  const filePath = parsedUrl.pathname;
  const file_name = path.basename(parsedUrl.pathname);
  describe(`${route} security download tests`, () => {
    afterEach(() => nock.cleanAll());

    it("allows download from whitelisted domain", async () => {
      nock(cdnCloudfront)
        .get(filePath)
        .reply(200, "filecontent", { "Content-Type": "text/plain" });

      const res = await request(getApp())
        .get(route)
        .query({ url: allowedUrl, file_name });
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/text\/plain/);
      expect(res.text).toBe("filecontent");
    });

    it("blocks CloudFront redirect bypass payload", async () => {
      const res = await request(getApp())
        .get(route)
        .query({ url: bypassPayload, file_name: "./" });
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Invalid|forbidden|Blocked/i);
    });

    it("blocks direct access to non-whitelisted domain", async () => {
      const res = await request(getApp())
        .get(route)
        .query({ url: externalUrl, file_name: path.basename(externalUrl) });
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Invalid|forbidden|Blocked/i);
    });

    it("blocks redirect from whitelisted domain to evil.com", async () => {
      nock(cdnCloudfront)
        .get(parsedUrl.pathname)
        .reply(302, undefined, { Location: "https://evil.com" });

      const res = await request(getApp())
        .get(route)
        .query({ url: allowedUrl, file_name });
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Invalid|forbidden|Blocked/i);
    });
  });
}

module.exports = { testDownloadSecurity };
