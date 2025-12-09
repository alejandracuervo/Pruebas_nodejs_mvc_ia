// src/middlewares/validate.js

module.exports = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((d) => d.message);

      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: details
      });
    }

    req.body = value;
    next();
  };
};
