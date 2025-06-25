const express = require("express");
const axios = require("axios");
const { URL } = require("url");

const ALLOWED_HOSTS = ["cdn.example.com"];
const safeAxios = axios.create({ timeout: 5000 });

// Whitelist enforcement (only allow HTTPS and ALLOWED_HOSTS)
safeAxios.interceptors.request.use(cfg => {
  const u = new URL(cfg.url, cfg.baseURL);
  if (u.protocol !== "https:" || !ALLOWED_HOSTS.includes(u.hostname)) {
    return Promise.reject(new Error(`Blocked hostname: ${u.hostname}`));
  }
  return cfg;
});

const router = express.Router();
router.get("/download", async (req, res) => {
  const url = req.query.url;
  const fname = req.query.file_name;
  if (!url || !fname) return res.status(400).send("Missing parameters");
  try {
    const resp = await safeAxios.get(url, {
      responseType: "stream",
      maxRedirects: 0,
    });
    res.setHeader("Content-Disposition", `attachment; filename=${encodeURIComponent(fname)}`);
    const contentType = resp.headers["content-type"] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    resp.data.pipe(res);
  } catch (e) {
    console.error(`Blocked or failed download: ${e.message}\n  url: ${url}\n  file_name: ${fname}`);
    res.status(400).send("Invalid or forbidden URL");
  }
});

module.exports = router;
