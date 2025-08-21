const router = require('express').Router();
const accountRoute = require('./account.route')
const dashboradRoute = require('./dashboard.route');
const categoryRoute = require('./category.route')
const tourRoute = require('./tour.route');
const orderRoute = require('./order.route')
const userRoute = require('./user.route');
const contactRoute = require('./contact.route');
const settingRoute = require('./setting.route');
const profileRoute = require('./profile.route');
router.use('/account', accountRoute);
router.use('/dashboard', dashboradRoute);
router.use('/category', categoryRoute);
router.use('/tour', tourRoute);
router.use('/order', orderRoute);
router.use('/user', userRoute);
router.use('/contact', contactRoute);
router.use('/setting', settingRoute);
router.use('/profile', profileRoute);
router.use((req, res) => {
  res.render('admin/pages/error-404', {
    title: '404 Not Found'
  })
})
module.exports = router;