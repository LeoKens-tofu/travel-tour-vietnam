const router = require('express').Router();
const profileController = require('../../controllers/admin/profile.controller');
const profileValidate = require("../../validates/admin/profile.validate");
const multer = require("multer");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/edit', profileController.edit);

router.patch('/edit', upload.single("avatar") ,profileValidate.profilePatch ,profileController.editPatch);

router.get('/change-password', profileController.changePassword); 

router.post('/change-password',profileValidate.changePasswordPost ,profileController.changePasswordPost); 

module.exports = router;