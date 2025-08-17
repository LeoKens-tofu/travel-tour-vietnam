const router = require('express').Router();
const tourController = require('../../controllers/client/tours.controller')
router.get('/', tourController.tour)
module.exports = router