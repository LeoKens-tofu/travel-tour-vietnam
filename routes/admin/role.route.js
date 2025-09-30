const router = require('express').Router();
const roleController = require('../../controllers/admin/role.controller'); 
const roleValidate = require("../../validates/admin/role.validate")

router.get('/list', roleController.list);

router.get('/edit/:id', roleController.edit);

router.patch('/edit/:id', roleValidate.createPost,roleController.editPatch);

router.get('/create', roleController.create);

router.post('/create', roleValidate.createPost ,roleController.createPost);

router.patch('/delete/:id',roleController.deletePatch);

module.exports = router;