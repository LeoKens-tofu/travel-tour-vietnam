module.exports.list = (req, res) => {
  res.render('admin/pages/order-list', {
    title: 'Order List'
  })
}

module.exports.edit = (req, res) => {
  res.render('admin/pages/order-edit', {
    title: 'Edit Order'
  })
}