const Joi = require("joi");
module.exports.registerPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Vui lòng nhập họ tên!",
      "string.min": "Họ tên phải có ít nhất 5 ký tự!",
      "string.max": "Họ tên không được vượt quá 50 ký tự!",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Email không đúng định dạng!",
    }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase");
        }
        if (!/[a-z]/.test(value)) {
          return helpers.error("password.lowercase");
        }
        if (!/\d/.test(value)) {
          return helpers.error("password.num");
        }
        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error("password.special");
        }
        return value;
      })
      .messages({
        "string.empty": "Vui lòng nhập password",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        "password.num": "Mật khẩu phải chứa ít nhất một chữ số!",
        "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
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

module.exports.loginPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Email không đúng định dạng!",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập password",
    }),
    rememberPassword: Joi.boolean(),
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

module.exports.forgotPasswordPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Email không đúng định dạng!",
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

module.exports.otpPasswordPost = (req, res, next) => {
  const schema = Joi.object({
    otp: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập mã OTP!",
    }),
    email: Joi.string(),
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

module.exports.resetPasswordPost = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase");
        }
        if (!/[a-z]/.test(value)) {
          return helpers.error("password.lowercase");
        }
        if (!/\d/.test(value)) {
          return helpers.error("password.num");
        }
        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error("password.special");
        }
        return value;
      })
      .messages({
        "string.empty": "Vui lòng nhập password",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        "password.num": "Mật khẩu phải chứa ít nhất một chữ số!",
        "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
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

module.exports.createAccountAdminPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Vui lòng nhập họ tên!",
      "string.min": "Họ tên phải có ít nhất 5 ký tự!",
      "string.max": "Họ tên không được vượt quá 50 ký tự!",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Email không đúng định dạng!",
    }),
    phone: Joi.string()
      .pattern(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/)
      .required()
      .messages({
        "string.empty": "Vui lòng nhập số điện thoại!",
        "string.pattern.base": "Số điện thoại không đúng định dạng!",
      }),
    role: Joi.string().allow(""),
    positionCompany: Joi.string().required().messages({
      "string.empty": "Vui lòng chọn chức vụ!",
    }),
    status: Joi.string().allow(""),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase");
        }
        if (!/[a-z]/.test(value)) {
          return helpers.error("password.lowercase");
        }
        if (!/\d/.test(value)) {
          return helpers.error("password.num");
        }
        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error("password.special");
        }
        return value;
      })
      .messages({
        "string.empty": "Vui lòng nhập password",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        "password.num": "Mật khẩu phải chứa ít nhất một chữ số!",
        "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
      }),
    avatar: Joi.string().allow(""),
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

module.exports.editAccountAdminPatch = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Vui lòng nhập họ tên!",
      "string.min": "Họ tên phải có ít nhất 5 ký tự!",
      "string.max": "Họ tên không được vượt quá 50 ký tự!",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Email không đúng định dạng!",
    }),
    phone: Joi.string()
      .pattern(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/)
      .required()
      .messages({
        "string.empty": "Vui lòng nhập số điện thoại!",
        "string.pattern.base": "Số điện thoại không đúng định dạng!",
      }),
    role: Joi.string().allow(""),
    positionCompany: Joi.string().required().messages({
      "string.empty": "Vui lòng chọn chức vụ!",
    }),
    status: Joi.string().allow(""),
    avatar: Joi.string().allow(""),
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