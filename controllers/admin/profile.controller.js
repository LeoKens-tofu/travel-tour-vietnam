module.exports.edit = (req, res) => {
  res.render('admin/pages/profile-edit', {
    title: 'Profile Edit'
  })
}

module.exports.changePassword = (req, res) => {
  res.render('admin/pages/profile-change-password', {
    title: 'Change Password'
  })
}
