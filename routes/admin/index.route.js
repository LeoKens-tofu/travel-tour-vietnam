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
const uploadRoute = require('./upload.route');
const authMiddleWare = require('../../middlewares/admin/auth.middleware');

router.use('/account', accountRoute);
router.use('/dashboard',authMiddleWare.verifyToken, dashboradRoute);
router.use('/category',authMiddleWare.verifyToken, categoryRoute);
router.use('/tour',authMiddleWare.verifyToken, tourRoute);
router.use('/order',authMiddleWare.verifyToken, orderRoute);
router.use('/user',authMiddleWare.verifyToken, userRoute);
router.use('/contact',authMiddleWare.verifyToken, contactRoute);
router.use('/setting',authMiddleWare.verifyToken, settingRoute);
router.use('/profile',authMiddleWare.verifyToken, profileRoute);
router.use('/upload', authMiddleWare.verifyToken, uploadRoute);
router.use(authMiddleWare.verifyToken, (req, res) => {
  res.render('admin/pages/error-404', {
    title: '404 Not Found'
  })
})
module.exports = router;