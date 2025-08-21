module.exports.list = (req, res) => {
  res.render('admin/pages/setting-role-list', {
    title: 'Role List'
  })
}

module.exports.create = (req, res) => {
  res.render('admin/pages/setting-role-create', {
    title: 'Create Role'
  })
}