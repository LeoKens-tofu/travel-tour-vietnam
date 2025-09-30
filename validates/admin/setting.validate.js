const Joi = require("joi");

module.exports.editPost = (req, res, next) => {
  const schema = Joi.object({
    websiteName: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập tên website!",
    }),
    email: Joi.string()
          .email()
          .messages({
            'string.email': 'Email không đúng định dạng!',
          }),
    phone: Joi.string().allow(""),
    address: Joi.string().allow(""),
    logo: Joi.string().allow(""),
    favicon: Joi.string().allow(""),
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

module.exports.salePatch = (req, res, next) => {
  const schema = Joi.object({
    saleName: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập tên ưu đãi!",
    }),
    endDate: Joi.string().allow(""),
    salePrice: Joi.string().allow(""),
    saleTour: Joi.string().allow(""),
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
}
