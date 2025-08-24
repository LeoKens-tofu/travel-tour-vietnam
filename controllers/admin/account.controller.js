const AccountAdmin = require('../../models/accounts-admin.model');
const bcrypt = require('bcryptjs');

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
  const { email, password} = req.body;
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

  res.json({
    code: 'success',
    message: 'Đăng nhập thành công!'
  })
}

module.exports.registerPost = async (req, res) => {
  const existAccount = await AccountAdmin.findOne({
    email: req.body.email
  }).exec(); ``

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

module.exports.otpPassword = (req, res) => {
  res.render('admin/pages/otp-password', {
    title: 'Admin OTP Password'
  })
}

module.exports.resetPassword = (req, res) => {
  res.render('admin/pages/reset-password', {
    title: 'Admin Reset Password'
  })
}