const express = require("express");
const axios = require("axios");

const router = express.Router();

// whitelist로 사용할 CDN 도메인 상수 선언
const cdnCloudfront = "https://cdn.example.com";

// 취약한 파일 다운로드 라우터 (startsWith로 whitelist만 허용)
router.get("/download", async (req, res) => {
  const url = req.query.url;
  const fname = req.query.file_name;
  if (!url || !fname) return res.status(400).send("Missing parameters");

  // whitelist 차단 로직 추가
  if (!url.startsWith(cdnCloudfront)) {
    return res.status(400).send("Invalid URL Error File Download");
  }

  try {
    const resp = await axios.get(url, { responseType: "stream" });
    res.setHeader("Content-Disposition", `attachment; filename=${encodeURIComponent(fname)}`);
    const contentType = resp.headers["content-type"] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    resp.data.pipe(res);
  } catch (e) {
    console.error(`Download failed: ${e.message}\n  url: ${url}\n  file_name: ${fname}`);
    res.status(500).send("Download failed");
  }
});

module.exports = router;
