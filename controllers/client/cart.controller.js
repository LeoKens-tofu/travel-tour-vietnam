module.exports.cart = (req, res) => {
  res.render('client/pages/cart', {
    title: 'Cart Page',
  });
}