const Joi = require("joi");

module.exports.createPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
          .email()
          .messages({
            'string.email': 'Email không đúng định dạng!',
          }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.json({
      code: "error",
      message: error.details[0].message,
    });
    return;
  }
  next();
};