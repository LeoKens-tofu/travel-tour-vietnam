const AccountAdmin = require("../../models/accounts-admin.model");
const Role = require("../../models/role.model");
const bcrypt = require("bcryptjs");

module.exports.list = async (req, res) => {
  const accountAdminList = await AccountAdmin.find({
    deleted: false,
  });

  for (const item of accountAdminList) {
    const role = await Role.findById(item.role);
    if (role) {
      item.roleName = role.name;
    }
  }

  res.render("admin/pages/setting-account-admin-list", {
    title: "Account Admin List",
    accountAdminList: accountAdminList,
  });
};

module.exports.edit = async (req, res) => {
  try {
    const roleList = await Role.find({ deleted: false });
    const id = req.params.id;
    const accountAdmin = await AccountAdmin.findById(id);

    res.render("admin/pages/setting-account-admin-edit", {
      title: "Edit Account Admin",
      roleList: roleList,
      accountAdmin: accountAdmin,
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau!",
    });
  }
};

module.exports.create = async (req, res) => {
  const roleList = await Role.find({ deleted: false });
  res.render("admin/pages/setting-account-admin-create", {
    title: "Create Account Admin",
    roleList: roleList,
  });
};

module.exports.createPost = async (req, res) => {
  try {
    const existAccount = await AccountAdmin.findOne({
      email: req.body.email,
    });

    if (existAccount) {
      res.json({
        code: "error",
        message: "Email đã tồn tại, vui lòng sử dụng email khác!",
      });
      return;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newAccount = new AccountAdmin(req.body);
    await newAccount.save();

    res.json({
      code: "success",
      message: "Tạo tài khoản admin thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi tạo account admin:", error);
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau!",
    });
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const existEmail = await AccountAdmin.findOne({
      _id: { $ne: id },
      email: req.body.email,
    });

    if (existEmail) {
      res.json({
        code: "error",
        message: "Email đã tồn tại, vui lòng sử dụng email khác!",
      });
      return;
    }

    const existAccount = await AccountAdmin.find({
      _id: id,
      deleted: false,
    });

    if (!existAccount) {
      res.json({
        code: "error",
        message: "Tài khoản admin không tồn tại!",
      });
      return;
    }

    req.body.updatedBy = req.account.id;

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await AccountAdmin.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Cập nhật tài khoản admin thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau!",
    });
  }
};

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await AccountAdmin.updateOne(
      {
        _id: id,
        deleted: false,
      },
      {
        deleted: true,
        deletedBy: req.account.id,
        deletedAt: Date.now(),
      }
    );

    res.json({
      code: "success",
      message: "Xoá tài khoản admin thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau!",
    });
  }
};

module.exports.trash = async (req, res) => {
  const accountAdminList = await AccountAdmin.find({
    deleted: true,
  })

  for (const item of accountAdminList) {
    const role = await Role.findById(item.role);
    if (role) {
      item.roleName = role.name;
    }
  }

  res.render("admin/pages/setting-account-admin-trash", {
    title: "Thùng rác tài khoản admin",
    accountAdminList: accountAdminList
  })
}

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await AccountAdmin.updateOne(
      {
        _id: id,
      },
      {
        deleted: false,
      }
    );

    res.json({
      code: "success",
      message: "Khôi phục tài khoản thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Không tìm thấy được bản ghi!",
    });
  }
};

module.exports.destroyDelete = async (req, res) => {
  try {
    const id = req.params.id;

    await AccountAdmin.deleteOne({
      _id: id,
    });

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