const buildTree = require("../../helpers/tree.helper");
const Category = require("../../models/category.model");
const AccountAdmin = require("../../models/accounts-admin.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  const filter = {
    deleted: false,
  };

  //Filter Status
  if (req.query.status) {
    filter.status = req.query.status;
  }
  //End Filter Status

  //Filter CreatedBy
  if (req.query.createdBy) {
    filter.createdBy = req.query.createdBy;
  }
  //End Filter CreatedBy

  const dateFilter = {};
  //Filter Start Date
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).toDate();
    dateFilter.$gte = startDate;
  }
  //End Filter Start Date

  //Filter End Date
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).toDate();
    dateFilter.$lte = endDate;
  }
  //End Filter End Date

  if (Object.keys(dateFilter).length > 0) {
    filter.createdAt = dateFilter;
  }

  const categoryList = await Category.find(filter).sort({
    position: "desc",
  });

  for (let item of categoryList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.createdBy,
    });
    if (infoAccount) item.createdByName = infoAccount.fullName;
  }

  for (let item of categoryList) {
    item.createByTimeFormat = moment(item.createdAt).format(
      "HH:mm - DD/MM/YYYY"
    );
    item.updateByTimeFormat = moment(item.updatedAt).format(
      "HH:mm - DD/MM/YYYY"
    );
  }

  const adminAccount = await AccountAdmin.find({});

  res.render("admin/pages/category-list", {
    title: "Category List",
    categoryList: categoryList,
    adminAccount: adminAccount,
  });
};

module.exports.create = async (req, res) => {
  let categoryList = await Category.find({
    deleted: false,
  });

  categoryList = buildTree(categoryList, "");

  res.render("admin/pages/category-create", {
    title: "Category Create",
    categoryList: categoryList,
  });
};

module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const total = await Category.countDocuments({});
    req.body.position = total + 1;
  }

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  const newCategory = new Category(req.body);
  await newCategory.save();

  res.json({
    code: "success",
    message: "Tạo category thành công!",
  });
};

module.exports.edit = async (req, res) => {
  try {
    let categoryList = await Category.find({
      deleted: false,
    });

    const categoryDetail = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });

    categoryList = buildTree(categoryList, "");

    res.render("admin/pages/category-edit", {
      title: "Category Edit",
      categoryList: categoryList,
      categoryDetail: categoryDetail,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/category/list`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const total = await Category.countDocuments({});
      req.body.position = total + 1;
    }

    req.body.updatedBy = req.account.id;

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await Category.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Cập nhật danh mục thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Không tìm được bản ghi!",
    });
  }
};

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Category.updateOne(
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

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await Category.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: option,
          }
        );
        res.json({
          code: "success",
          message: "Cập nhật bản ghi thành công!",
        });
        break;
      case "deleted":
        await Category.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()
          }
        );
        res.json({
          code: "success",
          message: "Cập nhật bản ghi thành công!",
        });
        break;
      default:
        res.json({
          code: "error",
          message: "Hành động không hợp lệ!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi không thể thay đổi trạng thái!",
    });
  }
};
