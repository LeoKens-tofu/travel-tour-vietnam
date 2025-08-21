module.exports.list = (req, res) => {
  res.render('admin/pages/user-list', {
    title: 'User List'
  })
}