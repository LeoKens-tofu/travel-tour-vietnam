module.exports.login = (req, res) => {
  res.render('admin/pages/login', {
    title: 'Admin Login',});
}

module.exports.register = (req, res) => {
  res.render('admin/pages/register',{
    title: 'Admin Register'
  })
}