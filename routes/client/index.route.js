const router = require('express').Router();
const homeRoute = require('./home.route');
const tourRoute = require('./tour.route');
const cartRoute = require('./cart.route');
const contactRoute = require("./contact.route");
const settingMiddleWare = require("../../middlewares/client/setting.middleware");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");

router.use(settingMiddleWare.webInfo);

router.use(categoryMiddleWare.list);

router.use('/', homeRoute);

router.use('/tour', tourRoute);

router.use('/cart', cartRoute);

router.use('/contact', contactRoute);

module.exports = router;