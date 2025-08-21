const router = require('express').Router();
const settingController = require('../../controllers/admin/setting.controller');
const accountAdminRoute = require('./account-admin.route');
const roleRoute = require('./role.route');
router.get('/list', settingController.list);
router.get('/web-info', settingController.webInfo);
router.use('/account-admin', accountAdminRoute);
router.use('/role', roleRoute);
module.exports = router;