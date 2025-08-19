module.exports.login = (req, res) => {
  res.render('admin/pages/login', {
    title: 'Admin Login',});
}

module.exports.register = (req, res) => {
  res.render('admin/pages/register',{
    title: 'Admin Register'
  })
}

module.exports.forgotPassword = (req, res) => {
  res.render('admin/pages/forgot-password',{
    title: 'Admin Forgot Password'
  })
}

module.exports.otpPassword = (req, res) => {
  res.render('admin/pages/otp-password',{
    title: 'Admin OTP Password'
  })
}