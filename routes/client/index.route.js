const router = require('express').Router();
const homeRoute = require('./home.route');
const tourRoute = require('./tour.route');
const cartRoute = require('./cart.route');
const contactRoute = require("./contact.route");
const settingMiddleWare = require("../../middlewares/client/setting.middleware");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");
const categoryRoute = require("./category.route");
const orderRoute = require('./order.route');
const searchRoute = require("./search.route");

router.use(settingMiddleWare.webInfo);

router.use(categoryMiddleWare.list);

router.use('/', homeRoute);

router.use('/category', categoryRoute);

router.use('/tour', tourRoute);

router.use('/cart', cartRoute);

router.use('/contact', contactRoute);

router.use('/search', searchRoute);

router.use('/order', orderRoute);

module.exports = router;