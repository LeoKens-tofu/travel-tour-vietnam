module.exports.list = (req, res) => {
  res.render('admin/pages/category-list', {
    title: 'Category List'
  })
}

module.exports.create = (req, res) => {
  res.render('admin/pages/category-create', {
    title: 'Category Create'
  })
}