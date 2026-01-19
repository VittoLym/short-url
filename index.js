const express = require("express");
const { nanoid } = require("nanoid");

const app = express();
const PORT = 4500;
const urls = new Map();
app.use(express.json());

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateUniqueCode() {
  let code;
  do {
    code = nanoid(6);
  } while (urls.has(code));
  return code;
}

app.post("/shorten", (req, res) => {
    const { url } = req.body;
    if (!url || !isValidUrl(url)) {
        return res.status(400).json({
            error: "Invalid URL provided"
        });
    }
    const now = new Date().toISOString();
    const shortCode = generateUniqueCode();
    const data = {
        id: shortCode,
        url,
        shortCode,
        createdAt: now,
        updatedAt: now,
        accessCount: 0,
        lastAccessAt: null
    };

    urls.set(shortCode, data);

    res.status(201).json(data);
});

app.get("/shorten/:code", (req, res) => {
    const data = urls.get(req.params.code);
    if (!data) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    res.json(data);
});

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

app.delete("/shorten/:code", (req, res) => {
  if (!urls.has(req.params.code)) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  urls.delete(req.params.code);
  res.status(204).send();
});

app.get("/shorten/:code/stats", (req, res) => {
  const data = urls.get(req.params.code);

  if (!data) {
    return res.status(404).json({
      error: "Short URL not found"
    });
  }

  res.json({
    id: data.id,
    url: data.url,
    shortCode: data.shortCode,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    accessCount: data.accessCount,
    lastAccessAt: data.lastAccessAt
  });
});

app.get("/:code", (req, res) => {
    const data = urls.get(req.params.code);

    if (!data) {
        return res.status(404).json({
        error: "Short URL not found"
        });
    }

    data.accessCount += 1;
    data.lastAccessAt = new Date().toISOString();

    res.redirect(302, data.url);
});

app.listen(PORT, () => {
  console.log(`🚀 URL Shortener running on http://localhost:${PORT}`);
});
