const router = require('express').Router();
const tourController = require('../../controllers/client/tours.controller')

router.get('/detail/:slug', tourController.detail)

module.exports = router