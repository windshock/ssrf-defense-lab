const express = require("express");
const { testDownloadSecurity } = require("../testUtils/testDownloadSecurity");
const secureRouter = require("./secureRouter");

describe("/download (secureRouter)", () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(secureRouter);
  });

  testDownloadSecurity(() => app, {
    route: "/download",
    allowedUrl: "https://cdn.example.com/file.txt",
    bypassPayload: "https://cdn.example.com@302.r3dir.me/--to/?url=https://evil.com/favicon.ico",
    externalUrl: "https://evil.com/favicon.ico",
    cdnCloudfront: "https://cdn.example.com"
  });
});
