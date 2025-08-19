const router = require('express').Router();
const homeRoute = require('./home.route');
const tourRoute = require('./tour.route');
const cartRoute = require('./cart.route');
router.use('/', homeRoute);
router.use('/tours', tourRoute);
router.use('/cart', cartRoute);
module.exports = router;