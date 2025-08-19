const router = require('express').Router();
const homeRoute = require('./home.route');
const tourRoute = require('./tour.route');
router.use('/', homeRoute);
router.use('/tours', tourRoute);
module.exports = router;