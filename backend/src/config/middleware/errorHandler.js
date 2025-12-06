// backend/src/middleware/errorHandler.js

export const notFound = (req, res, next) => {
  res.status(404);
  res.json({ message: `Not found - ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || "Server error"
  });
};
