const AccountAdmin = require('../../models/accounts-admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateHelper = require('../../helpers/generate.helper');
const OTPPassword = require('../../models/otp-password.model');
const mailHelper = require('../../helpers/mail.helper');

module.exports.login = (req, res) => {
  res.render('admin/pages/login', {
    title: 'Admin Login',
  });
}

module.exports.register = (req, res) => {
  res.render('admin/pages/register', {
    title: 'Admin Register'
  })
}

module.exports.registerInit = (req, res) => {
  res.render('admin/pages/register-initial', {
    title: 'Admin Register Initial'
  })
}

module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;
  const existAccount = await AccountAdmin.findOne({
    email: email,
  })

  if (!existAccount) {
    res.json({
      code: 'error',
      message: 'Email chưa được đăng ký trên hệ thống!'
    })
    return;
  }

  if (!await bcrypt.compare(password, existAccount.password)) {
    res.json({
      code: 'error',
      message: 'Mật khẩu không đúng!'
    })
    return;
  }

  if (existAccount.status != 'active') {
    res.json({
      code: 'error',
      message: 'Tài khoản chưa được kích hoạt!'
    })
    return;
  }

  const updateAccount = await AccountAdmin.findOneAndUpdate({
    _id: existAccount.id
  }, {
    count: existAccount.count + 1
  }, {
    new: true
  })

  const token = jwt.sign(
    {
      id: updateAccount.id,
      email: updateAccount.email,
      count: updateAccount.count
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? '7d' : '1d'
    }
  );

  res.cookie('token', token, {
    maxAge: rememberPassword ? 7 * (24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'strict'
  });

  res.json({
    code: 'success',
    message: 'Đăng nhập thành công!'
  })
}

module.exports.registerPost = async (req, res) => {
  const existAccount = await AccountAdmin.findOne({
    email: req.body.email
  }).exec();

  if (existAccount) {
    res.json({
      code: "error",
      message: "Tài khoản đã tồn tại trong hệ thống"
    })
    return;
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  req.body.status = 'initial';

  const account = new AccountAdmin(req.body);
  await account.save();

  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công"
  })
}

module.exports.forgotPassword = (req, res) => {
  res.render('admin/pages/forgot-password', {
    title: 'Admin Forgot Password'
  })
}

module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email,
    status: 'active'
  })

  if (!existAccount) {
    res.json({
      code: 'error',
      message: 'Email không tồn tại trong hệ thống!'
    })
    return;
  }

  const existOTP = await OTPPassword.findOne({
    email: email
  })

  if (existOTP) {
    res.json({
      code: 'error',
      message: 'Vui lòng thử lại sau 5 phút!'
    })
    return;
  }

  const otp = generateHelper.generateRandomNumber(6);

  const otpRecord = new OTPPassword({
    email: email,
    otp: otp,
    expireAt: Date.now() + 5 * 60 * 1000
  });

  await otpRecord.save();

  const title = 'Mã OTP lấy lại mật khẩu'
  const content = `Mã OTP của bạn là <b>${otp}</b> có hiệu lực trong 5 phút. Không chia sẻ mã này cho bất kì ai.`
  mailHelper.sendMail(email, title, content);

  res.json({
    code: 'success',
    message: ''
  })
}

module.exports.otpPassword = (req, res) => {
  res.render('admin/pages/otp-password', {
    title: 'Admin OTP Password'
  })
}

module.exports.otpPasswordPost = async (req, res) => {
  const { email, otp } = req.body;

  const existOTP = await OTPPassword.findOne({
    email: email,
    otp: otp
  })

  if (!existOTP) {
    res.json({
      code: 'error',
      message: 'Mã OTP không hợp lệ'
    })
    return;
  }

  const account = await AccountAdmin.findOne({
    email: email
  })

  const token = jwt.sign({
    id: account.id,
    email: account.email,
    count: account.count
  }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.cookie('token', token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict'
  })

  res.json({
    code: 'success',
    message: 'Xác thực thành công!'
  })
}

module.exports.resetPassword = (req, res) => {
  res.render('admin/pages/reset-password', {
    title: 'Admin Reset Password'
  })
}

module.exports.resetPasswordPost = async (req, res) => {
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  await AccountAdmin.updateOne({
    _id: req.account.id
  }, {
    password: hashPassword
  });

  res.json({
    code: 'success',
    message: 'Đổi mật khẩu thành công!'
  })
}

module.exports.logoutPost = (req, res) => {
  res.clearCookie('token');
  res.json({
    code: 'success',
    message: 'Đăng xuất thành công!'
  })
}