// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    details: err.message,
  });
};
