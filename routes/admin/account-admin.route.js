const router = require('express').Router();
const accountAdminController = require('../../controllers/admin/account-admin.controller');
const accountAdminValidate = require('../../validates/admin/account.validate');
const multer = require("multer");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/list', accountAdminController.list);

router.get('/create', accountAdminController.create);

router.post('/create', upload.single("avatar"), accountAdminValidate.createAccountAdminPost ,accountAdminController.createPost);

router.get('/edit/:id', accountAdminController.edit);

router.patch('/edit/:id', upload.single("avatar"), accountAdminValidate.editAccountAdminPatch ,accountAdminController.editPatch);

router.patch('/delete/:id', accountAdminController.deletePatch);

router.patch('/undo/:id', accountAdminController.undoPatch);

router.get('/trash', accountAdminController.trash);

router.delete('/trash/destroy/:id', accountAdminController.destroyDelete);

module.exports = router;