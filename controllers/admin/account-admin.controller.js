module.exports.list = (req, res) => {
  res.render('admin/pages/setting-account-admin-list', {
    title: 'Account Admin List'
  })
}

module.exports.create = (req, res) => {
  res.render('admin/pages/setting-account-admin-create', {
    title: 'Create Account Admin'
  })
}