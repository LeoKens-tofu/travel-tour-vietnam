const router = require('express').Router();
const tourController = require('../../controllers/client/tours.controller')
router.get('/', tourController.tour)
router.get('/detail', tourController.detail)
module.exports = router