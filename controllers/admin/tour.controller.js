const buildTree = require("../../helpers/tree.helper");
const Category = require("../../models/category.model");
const moment = require("moment-timezone");
const AccountAdmin = require("../../models/accounts-admin.model");
const Tour = require("../../models/tours.model");
const City = require("../../models/city.model");
const slugify = require("slugify");

module.exports.list = async (req, res) => {
  if (!req.permissions.includes("tour-view")){
    res.redirect(`/${pathAdmin}/404NOTFOUND`);
    return;
  }
  
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

  //Filter Price
  let priceFilter = {};

  let rolePrice = null;
  if (req.query.price) {
    rolePrice = req.query.price;
  }
  if (req.query.minPrice && req.query.maxPrice) {
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);

    priceFilter.$gte = minPrice;
    priceFilter.$lte = maxPrice;
  }

  if (rolePrice) {
    if (Object.keys(priceFilter).length > 0) {
      if (rolePrice == "priceNewAdult") {
        filter.priceNewAdult = priceFilter;
      } else if (rolePrice == "priceNewChildren") {
        filter.priceNewChildren = priceFilter;
      } else if (rolePrice == "priceNewBaby") {
        filter.priceNewBaby = priceFilter;
      }
    }
  }
  //End Filter Price

  //Filter Category
  if (req.query.category) {
    filter.category = req.query.category;
  }
  //Filter Category

  let page = 1;
  const limitItems = 4;

  if (req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  const totalRecord = await Tour.countDocuments(filter);
  const totalPage = Math.ceil(totalRecord / limitItems);

  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage,
  };

  const tourList = await Tour.find(filter)
    .sort({
      position: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  for (let item of tourList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.createdBy,
    });
    if (infoAccount) {
      item.createdByName = infoAccount.fullName;
    }
  }

  for (let item of tourList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.updatedBy,
    });
    if (infoAccount) {
      item.updatedByName = infoAccount.fullName;
    }
  }

  for (let item of tourList) {
    item.createByTimeFormat = moment(item.createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm - DD/MM/YYYY");
    item.updateByTimeFormat = moment(item.updatedAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm - DD/MM/YYYY");
  }

  const adminAccount = await AccountAdmin.find({});
  const categoryList = await Category.find({ deleted: false });

  res.render("admin/pages/tour-list", {
    title: "Tour List",
    tourList: tourList,
    adminAccount: adminAccount,
    categoryList: categoryList,
    pagination: pagination,
  });
};

module.exports.create = async (req, res) => {
  let categoryList = await Category.find({
    deleted: false,
  });

  categoryList = buildTree(categoryList, "");

  const cityList = await City.find({});

  res.render("admin/pages/tour-create", {
    title: "Tour Create",
    categoryList: categoryList,
    cityList: cityList,
  });
};

module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const total = await Tour.countDocuments({});
    req.body.position = total + 1;
  }

  req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
  req.body.priceChildren = req.body.priceChildren
    ? parseInt(req.body.priceChildren)
    : 0;
  req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
  req.body.priceNewAdult = req.body.priceNewAdult
    ? parseInt(req.body.priceNewAdult)
    : 0;
  req.body.priceNewChildren = req.body.priceNewChildren
    ? parseInt(req.body.priceNewChildren)
    : 0;
  req.body.priceNewBaby = req.body.priceNewBaby
    ? parseInt(req.body.priceNewBaby)
    : 0;
  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
  req.body.stockChildren = req.body.stockChildren
    ? parseInt(req.body.stockChildren)
    : 0;
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
  req.body.departureDate = req.body.departureDate
    ? new Date(req.body.departureDate)
    : null;
  req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  const newTour = new Tour(req.body);
  await newTour.save();

  res.json({
    code: "success",
    message: "Tạo category thành công!",
  });
};

module.exports.trash = async (req, res) => {
  const filter = {
    deleted: true,
  };

  //Pagination
  let page = 1;
  const limitItems = 4;

  if (req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  const totalRecord = await Tour.countDocuments(filter);
  const totalPage = Math.ceil(totalRecord / limitItems);

  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage,
  };
  //End Pagination

  //Searching
  if (req.query.search) {
    const keyWord = slugify(req.query.search);
    const keyWordRegex = new RegExp(keyWord, "i");
    filter.slug = keyWordRegex;
  }
  //End Searching

  const tourList = await Tour.find(filter)
    .sort({
      position: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  for (let item of tourList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.createdBy,
    });
    if (infoAccount) {
      item.createdByName = infoAccount.fullName;
    }
  }

  for (let item of tourList) {
    const infoAccount = await AccountAdmin.findOne({
      _id: item.deletedBy,
    });
    if (infoAccount) {
      item.deletedByName = infoAccount.fullName;
    }
  }

  for (let item of tourList) {
    item.createByTimeFormat = moment(item.createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm - DD/MM/YYYY");
    item.deleteByTimeFormat = moment(item.deletedAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/tour-trash", {
    title: "Tour Trash",
    tourList: tourList,
    pagination: pagination,
  });
};

module.exports.edit = async (req, res) => {
  try {
    let categoryList = await Category.find({
      deleted: false,
    });

    const tourDetail = await Tour.findOne({
      _id: req.params.id,
      deleted: false,
    });

    categoryList = buildTree(categoryList, "");

    if (tourDetail.departureDate) {
      tourDetail.departureDateFormat = moment(tourDetail.departureDate).format(
        "YYYY-MM-DD"
      );
    }

    const cityList = await City.find({});

    res.render("admin/pages/tour-edit", {
      title: "Tour Edit",
      categoryList: categoryList,
      cityList: cityList,
      tourDetail: tourDetail,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const total = await Tour.countDocuments({});
      req.body.position = total + 1;
    }

    req.body.priceAdult = req.body.priceAdult
      ? parseInt(req.body.priceAdult)
      : 0;
    req.body.priceChildren = req.body.priceChildren
      ? parseInt(req.body.priceChildren)
      : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult
      ? parseInt(req.body.priceNewAdult)
      : 0;
    req.body.priceNewChildren = req.body.priceNewChildren
      ? parseInt(req.body.priceNewChildren)
      : 0;
    req.body.priceNewBaby = req.body.priceNewBaby
      ? parseInt(req.body.priceNewBaby)
      : 0;
    req.body.stockAdult = req.body.stockAdult
      ? parseInt(req.body.stockAdult)
      : 0;
    req.body.stockChildren = req.body.stockChildren
      ? parseInt(req.body.stockChildren)
      : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations
      ? JSON.parse(req.body.locations)
      : [];
    req.body.departureDate = req.body.departureDate
      ? new Date(req.body.departureDate)
      : null;
    req.body.schedules = req.body.schedules
      ? JSON.parse(req.body.schedules)
      : [];

    req.body.updatedBy = req.account.id;
    const tourList = await Tour.find({ deleted: false });

    for (let item of tourList) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.updatedBy,
      });
      if (infoAccount) {
        item.updatedByName = infoAccount.fullName;
      }
    }

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await Tour.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Cập nhật tour thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Thao tác không hợp lệ! Vui lòng kiểm tra lại!",
    });
  }
};

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Tour.updateOne(
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
        await Tour.updateMany(
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
        await Tour.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: false,
          }
        );
        res.json({
          code: "success",
          message: "Cập nhật bản ghi thành công!",
        });
        break;
      case "destroy":
        await Tour.deleteMany({
          _id: { $in: ids },
        });
        res.json({
          code: "success",
          message: "Xóa bản ghi thành công!",
        });
        break;
      case "deleted":
        await Tour.updateMany(
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

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Tour.updateOne(
      {
        _id: id,
      },
      {
        deleted: false,
      }
    );

    res.json({
      code: "success",
      message: "Cập nhật bản ghi thành công!",
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

    await Tour.deleteOne({
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
