# 🔗 URL Shortener API

A simple RESTful URL shortening service built with **Node.js**, **Express**, and **nanoid**.
It allows you to create, retrieve, update, delete, and track statistics for short URLs, with built-in redirection support.

---

## ✨ Features

* Create short URLs
* Redirect short URLs to the original URL
* Retrieve short URL details
* Update an existing short URL
* Delete a short URL
* Get access statistics (number of visits, last access time)
* In-memory storage using `Map` (no database required)

---

## 🛠 Tech Stack

* **Node.js**
* **Express**
* **nanoid**

---

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node index.js
   ```

The server will run on:
👉 `http://localhost:4500`

---

## 🚀 API Endpoints

### Create a short URL

**POST** `/shorten`

**Body:**

```json
{
  "url": "https://example.com"
}
```

**Response (201):**

```json
{
  "id": "abc123",
  "url": "https://example.com",
  "shortCode": "abc123",
  "createdAt": "2026-01-16T20:00:00.000Z",
  "updatedAt": "2026-01-16T20:00:00.000Z",
  "accessCount": 0,
  "lastAccessAt": null
}
```

---

### Retrieve a short URL

**GET** `/shorten/:code`

---

### Update a short URL

**PUT** `/shorten/:code`

**Body:**

```json
{
  "url": "https://new-url.com"
}
```

---

### Delete a short URL

**DELETE** `/shorten/:code`

**Response:** `204 No Content`

---

### Get statistics

**GET** `/shorten/:code/stats`

**Response:**

```json
{
  "id": "abc123",
  "url": "https://example.com",
  "shortCode": "abc123",
  "createdAt": "...",
  "updatedAt": "...",
  "accessCount": 5,
  "lastAccessAt": "..."
}
```

---

### Redirect to original URL

**GET** `/:code`

Example:

```
http://localhost:4500/abc123
```

➡ Redirects (302) to the original URL and updates access statistics.

---

## ⚠️ Notes

* Data is stored **in memory**, so all URLs are lost when the server restarts.
* URL validation is handled using the built-in `URL` constructor.
* Short codes are guaranteed to be unique.

---

## 🧠 Possible Improvements

* Persist data using a database (PostgreSQL, MongoDB, Redis)
* Add authentication / rate limiting
* Custom aliases for short URLs
* Expiration dates (TTL)
* Docker support
* Production-ready logging

---

## 📄 License

MIT License

---

Made with ❤️ for learning and real-world practice.
