const Joi = require("joi");

module.exports.editPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Vui lòng nhập họ tên!",
      "string.min": "Họ tên phải có ít nhất 5 ký tự!",
      "string.max": "Họ tên không được vượt quá 50 ký tự!",
    }),
    phone: Joi.string()
      .pattern(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/)
      .required()
      .messages({
        "string.empty": "Vui lòng nhập số điện thoại!",
        "string.pattern.base": "Số điện thoại không đúng định dạng!",
      }),
    note: Joi.string().allow(""),
    paymentMethod: Joi.string().allow(""),
    paymentStatus: Joi.string().allow(""),
    status: Joi.string().allow(""),
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
