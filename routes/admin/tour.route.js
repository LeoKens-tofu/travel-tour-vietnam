const router = require("express").Router();
const tourController = require("../../controllers/admin/tour.controller");
const multer = require("multer");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });
const tourValidate = require("../../validates/admin/tour.validate");

router.get("/list", tourController.list);

router.get("/create", tourController.create);

router.post(
  "/create",
  upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'images', maxCount: 10}
  ]),
  tourValidate.createPost,
  tourController.createPost
);

router.get("/trash", tourController.trash);

router.patch("/trash/undo/:id", tourController.undoPatch);

router.delete("/trash/destroy/:id", tourController.destroyDelete);

router.get('/edit/:id', tourController.edit);

router.patch(
  "/edit/:id",
  upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'images', maxCount: 10}
  ]),
  tourValidate.createPost,
  tourController.editPatch
);

router.patch('/delete/:id', tourController.deletePatch);

router.patch('/check-multi', tourController.changeMultiPatch);

router.delete('/check-multi', tourController.changeMultiPatch);

module.exports = router;

