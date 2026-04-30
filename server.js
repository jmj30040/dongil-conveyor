const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 8080;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(req.url.split("?")[0]);

  if (requestPath === "/api/works-images") {
    const worksDir = path.join(root, "images", "works");

    fs.readdir(worksDir, { withFileTypes: true }, (error, entries) => {
      if (error) {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end("[]");
        return;
      }

      const images = entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, "ko"))
        .map((name) => ({
          name,
          download_url: `/images/works/${encodeURIComponent(name)}`,
        }));

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(images));
    });
    return;
  }

  const routePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(root, routePath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`동일컨베어 테스트 서버: http://localhost:${port}`);
});
