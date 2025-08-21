const router = require('express').Router();
const accountAdminController = require('../../controllers/admin/account-admin.controller');
router.get('/list', accountAdminController.list);
router.get('/create', accountAdminController.create);
module.exports = router;