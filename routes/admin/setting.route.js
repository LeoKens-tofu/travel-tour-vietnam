const router = require("express").Router();
const settingController = require("../../controllers/admin/setting.controller");
const accountAdminRoute = require("./account-admin.route");
const roleRoute = require("./role.route");
const multer = require("multer");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });
const settingValidate = require("../../validates/admin/setting.validate");

router.get("/list", settingController.list);

router.get("/sales", settingController.sales);

router.patch("/sales", settingValidate.salePatch ,settingController.salesPatch);

router.get("/web-info", settingController.webInfo);

router.patch(
  "/web-info",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  settingValidate.editPost,
  settingController.webInfoPatch
);

router.use("/account-admin", accountAdminRoute);

router.use("/role", roleRoute);

module.exports = router;
