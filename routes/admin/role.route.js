const router = require('express').Router();
const roleController = require('../../controllers/admin/role.controller');
router.get('/list', roleController.list);
router.get('/create', roleController.create);
module.exports = router;