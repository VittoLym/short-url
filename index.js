const express = require("express");
const { nanoid } = require("nanoid");

const app = express();
app.use(express.json());

const PORT = 3000;

// In-memory DB
const urls = new Map();

/**
 * Helpers
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * CREATE short URL
 * POST /shorten
 */
app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const shortCode = nanoid(6);
  const now = new Date().toISOString();

  const data = {
    id: shortCode,
    url,
    shortCode,
    createdAt: now,
    updatedAt: now,
    accessCount: 0
  };

  urls.set(shortCode, data);

  res.status(201).json(data);
});

/**
 * RETRIEVE original URL
 * GET /shorten/:code
 */
app.get("/shorten/:code", (req, res) => {
  const data = urls.get(req.params.code);

  if (!data) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.json(data);
});

/**
 * UPDATE short URL
 * PUT /shorten/:code
 */
app.put("/shorten/:code", (req, res) => {
  const data = urls.get(req.params.code);
  const { url } = req.body;

  if (!data) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  data.url = url;
  data.updatedAt = new Date().toISOString();

  res.json(data);
});

/**
 * DELETE short URL
 * DELETE /shorten/:code
 */
app.delete("/shorten/:code", (req, res) => {
  if (!urls.has(req.params.code)) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  urls.delete(req.params.code);
  res.status(204).send();
});

/**
 * STATS
 * GET /shorten/:code/stats
 */
app.get("/shorten/:code/stats", (req, res) => {
  const data = urls.get(req.params.code);

  if (!data) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.json(data);
});

/**
 * REDIRECT
 * GET /:code
 */
app.get("/:code", (req, res) => {
  const data = urls.get(req.params.code);

  if (!data) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  data.accessCount++;
  res.redirect(302, data.url);
});

app.listen(PORT, () => {
  console.log(`🚀 URL Shortener running on http://localhost:${PORT}`);
});
