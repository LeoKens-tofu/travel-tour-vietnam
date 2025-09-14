const buildTree = require("../../helpers/tree.helper");
const Category = require("../../models/category.model");
const moment = require("moment-timezone");
const AccountAdmin = require("../../models/accounts-admin.model");
const Tour = require("../../models/tours.model");
const City = require("../../models/city.model");

module.exports.list = (req, res) => {
  res.render("admin/pages/tour-list", {
    title: "Tour List",
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
    const total = await Category.countDocuments({});
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

module.exports.trash = (req, res) => {
  res.render("admin/pages/tour-trash", {
    title: "Tour Trash",
  });
};
