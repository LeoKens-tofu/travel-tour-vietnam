const { permissionList, pathAdmin } = require("../../config/variable.config");
const slugify = require("slugify");
const Role = require("../../models/role.model");

module.exports.list = async (req, res) => {
  const roleList = await Role.find(
    { deleted: false },
    { name: 1, description: 1 }
  );
  res.render("admin/pages/setting-role-list", {
    title: "Role List",
    roleList: roleList,
  });
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false,
    });

    if (!roleDetail) {
      res.redirect(`/${pathAdmin}/setting/role/list`);
      return;
    }

    res.render("admin/pages/setting-role-edit", {
      title: "Role Edit",
      permissionList: permissionList,
      roleDetail: roleDetail,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/role/list`);
  }
};

module.exports.create = (req, res) => {
  res.render("admin/pages/setting-role-create", {
    title: "Create Role",
    permissionList: permissionList,
  });
};

module.exports.createPost = async (req, res) => {
  try {
    const permission = slugify(req.body.name).toLowerCase();
    const existPermission = await Role.findOne({
      slug: permission,
      deleted: false,
    });
    if (existPermission) {
      res.json({
        code: "error",
        message: "Quyền đã tồn tại!",
      });
      return;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Tạo thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Xảy ra lỗi hệ thống!",
    });
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.updatedBy = req.account.id;

    const existRole = await Role.findOne({
      _id: id,
      deleted: false,
    });
    if (!existRole) {
      res.json({
        code: "error",
        message: "Bản ghi không tồn tại!",
      });
      return;
    }

    await Role.updateOne(
      {
        _id: id,
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi hệ thống!",
    });
  }
};

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedBy: req.account.id,
        deletedAt: Date.now(),
      }
    );

    res.json({
      code: "success",
      message: "Xóa bản ghi thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Không tìm thấy được bản ghi!",
    });
  }
};
