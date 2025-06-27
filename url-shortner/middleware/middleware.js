// middleware/middleware.js

// Middleware: Request Logger
const logger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
};

// Middleware: Error Handler
const errorHandler = (err, req, res, next) => {
  console.error("Middleware caught error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
};

// Middleware: Simple URL Validator
const validateUrl = (req, res, next) => {
  const { destination } = req.body;
  try {
    new URL(destination); // throws if invalid
    next();
  } catch {
    res.status(400).json({ error: "Invalid URL format" });
  }
};

// Export all
module.exports = {
  logger,
  errorHandler,
  validateUrl,
};
