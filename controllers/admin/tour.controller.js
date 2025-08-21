module.exports.list = (req, res) => {
  res.render('admin/pages/tour-list', {
    title: 'Tour List'
  })
}

module.exports.create = (req, res) => {
  res.render('admin/pages/tour-create', {
    title: 'Tour Create'
  })
}

module.exports.trash = (req, res) => {
  res.render('admin/pages/tour-trash', {
    title: 'Tour Trash'
  })
}