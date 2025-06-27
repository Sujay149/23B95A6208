// middleware/server.js
const express = require("express");
const cors = require("cors");
const { logger, errorHandler, validateUrl } = require("./middleware"); // ← updated path

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger); // log all requests

app.post("/api/shorten", validateUrl, (req, res) => {
  const { destination, customSlug } = req.body;
  const slug = customSlug || Math.random().toString(36).substr(2, 6);
  res.json({ slug });
});

app.use(errorHandler); // handles errors globally

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
