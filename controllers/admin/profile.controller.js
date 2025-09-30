const Role = require("../../models/role.model");
const AccountAdmin = require("../../models/accounts-admin.model");
const bcrypt = require("bcryptjs");

module.exports.edit = async (req, res) => {
  res.render("admin/pages/profile-edit", {
    title: "Profile Edit",
    profileDetail: req.account,
  });
};

module.exports.editPatch = async (req, res) => {
  try {
    const existEmail = await AccountAdmin.findOne({
      _id: { $ne: req.account.id },
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
      _id: req.account.id,
      deleted: false,
    });

    if (!existAccount) {
      res.json({
        code: "error",
        message: "Tài khoản admin không tồn tại!",
      });
      return;
    }

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await AccountAdmin.updateOne(
      {
        _id: req.account.id,
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
      message: "Cập nhật thất bại!",
    });
  }
};

module.exports.changePassword = (req, res) => {
  res.render("admin/pages/profile-change-password", {
    title: "Change Password",
  });
};

module.exports.changePasswordPost = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    await AccountAdmin.updateOne(
      {
        _id: req.account.id,
        deleted: false,
      },
      {
        password: req.body.password,
        tokenVersion: req.account.tokenVersion + 1,
      }
    );

    res.clearCookie('token');

    res.json({
      code: "success",
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đổi mật khẩu thất bại!",
    });
  }
};
