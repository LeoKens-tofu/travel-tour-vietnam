module.exports.list = (req, res) => {
  res.render('admin/pages/setting-list', {
    title: 'Setting List'
  })
}

module.exports.webInfo = (req, res) => {
  res.render('admin/pages/setting-website-info', {
    title: 'Website Information'
  })
}