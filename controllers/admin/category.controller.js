const buildTree = require("../../helpers/tree.helper");
const Category = require("../../models/category.model");
const AccountAdmin = require("../../models/accounts-admin.model");
const moment = require("moment-timezone");
const slugify = require("slugify");

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
    const startDate = moment(req.query.startDate)
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    dateFilter.$gte = startDate;
  }
  //End Filter Start Date

  //Filter End Date
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).tz("Asia/Ho_Chi_Minh").toDate();
    dateFilter.$lte = endDate;
  }
  //End Filter End Date

  if (Object.keys(dateFilter).length > 0) {
    filter.createdAt = dateFilter;
  }

  //Searching
  if (req.query.search) {
    const keyWord = slugify(req.query.search);
    const keyWordRegex = new RegExp(keyWord, "i");
    filter.slug = keyWordRegex;
  }
  //End Searching

  //Pagination
  let page = 1;
  const limitItems = 4;

  if (req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }

  const skip = (page - 1) * limitItems;
  const totalRecord = await Category.countDocuments(filter);
  const totalPage = Math.ceil(totalRecord / limitItems);

  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage,
  };

  //End Pagination

  const categoryList = await Category.find(filter)
    .sort({
      position: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  for (let item of categoryList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.createdBy,
    });
    if (infoAccount) {
      item.createdByName = infoAccount.fullName;
    }
  }

  for (let item of categoryList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.updatedBy,
    });
    if (infoAccount) {
      item.updatedByName = infoAccount.fullName;
    }
  }

  for (let item of categoryList) {
    item.createByTimeFormat = moment(item.createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm - DD/MM/YYYY");
    item.updateByTimeFormat = moment(item.updatedAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm - DD/MM/YYYY");
  }

  const adminAccount = await AccountAdmin.find({});

  res.render("admin/pages/category-list", {
    title: "Category List",
    categoryList: categoryList,
    adminAccount: adminAccount,
    pagination: pagination,
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
      case "undo":
        await Category.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: false,
          }
        );
        res.json({
          code: "success",
          message: "Khôi phục category thành công!",
        });
        break;
      case "destroy":
        await Category.deleteMany({
          _id: { $in: ids },
        });
        res.json({
          code: "success",
          message: "Xóa vĩnh viễn category thành công!",
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
            deletedAt: Date.now(),
          }
        );
        res.json({
          code: "success",
          message: "Xóa category thành công!",
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

module.exports.trash = async (req, res) => {
  const filter = {
    deleted: true,
  };

  //Searching
  if (req.query.search) {
    const keyWord = slugify(req.query.search);
    const keyWordRegex = new RegExp(keyWord, "i");
    filter.slug = keyWordRegex;
  }
  //End Searching

  //Pagination
  let page = 1;
  const limitItems = 4;

  if (req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }

  const skip = (page - 1) * limitItems;
  const totalRecord = await Category.countDocuments(filter);
  const totalPage = Math.ceil(totalRecord / limitItems);

  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage,
  };

  //End Pagination

  const categoryList = await Category.find(filter)
    .sort({
      position: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  for (let item of categoryList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.createdBy,
    });
    if (infoAccount) {
      item.createdByName = infoAccount.fullName;
    }
  }

  for (let item of categoryList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.updatedBy,
    });
    if (infoAccount) {
      item.updatedByName = infoAccount.fullName;
    }
  }

  for (let item of categoryList) {
    item.createByTimeFormat = moment(item.createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm - DD/MM/YYYY");
    item.updateByTimeFormat = moment(item.updatedAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm - DD/MM/YYYY");
  }

  const adminAccount = await AccountAdmin.find({});

  res.render("admin/pages/category-trash", {
    title: "Category Trash",
    categoryList: categoryList,
    adminAccount: adminAccount,
    pagination: pagination,
  });
};

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Category.updateOne(
      {
        _id: id,
      },
      {
        deleted: false,
      }
    );

    res.json({
      code: "success",
      message: "Khôi phục bản ghi thành công!",
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

    await Category.deleteOne({
      _id: id,
    });

    res.json({
      code: "success",
      message: "Xóa vĩnh viến category thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Không tìm thấy được bản ghi!",
    });
  }
};
