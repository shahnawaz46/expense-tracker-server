export const validateRequest = (schema) => {
  return (req, res, next) => {
    // console.log("req.body:", req.body);
    const { error } = schema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      const errorMessages = error.details[0]?.message;
      // console.log("errorMessages:", errorMessages);
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    next();
  };
};
