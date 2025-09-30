const WebInfo = require("../../models/web-info.model");
const Tour = require("../../models/tours.model");
const Sale = require("../../models/sale.model");
const moment = require("moment-timezone");

module.exports.list = (req, res) => {
  res.render("admin/pages/setting-list", {
    title: "Setting List",
  });
};

module.exports.webInfo = async (req, res) => {
  const webInfo = await WebInfo.findOne({});

  res.render("admin/pages/setting-website-info", {
    title: "Website Information",
    webInfo: webInfo,
  });
};

module.exports.webInfoPatch = async (req, res) => {
  try {
    const existRecord = await WebInfo.findOne({});

    if (req.files && req.files.logo) {
      req.body.logo = req.files.logo[0].path;
    } else {
      delete req.body.logo;
    }

    if (req.files && req.files.favicon) {
      req.body.favicon = req.files.favicon[0].path;
    } else {
      delete req.body.favicon;
    }

    if (!existRecord) {
      const newRecord = new WebInfo(req.body);
      await newRecord.save();
    } else {
      await WebInfo.updateOne(
        {
          _id: existRecord.id,
        },
        req.body
      );
    }

    res.json({
      code: "success",
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra! Vui lòng thử lại",
    });
  }
};

module.exports.sales = async (req, res) => {
  const tourList = await Tour.find({
    deleted: false,
    status: "active",
  });

  const sale = await Sale.findOne({});

  if (sale.endDate) {
    sale.endDateFormat = moment(sale.endDate)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD");
  }

  res.render("admin/pages/setting-sales", {
    title: "Setting Sales",
    tourList: tourList,
    sale: sale,
  });
};

module.exports.salesPatch = async (req, res) => {
  try {
    const existRecord = await Sale.findOne({});

    req.body.salePrice = req.body.salePrice ? parseInt(req.body.salePrice) : 0;
    req.body.endDate = req.body.endDate ? new Date(req.body.endDate) : null;
    req.body.saleTour = req.body.saleTour ? JSON.parse(req.body.saleTour) : [];

    if (!existRecord) {
      const newRecord = new Sale(req.body);
      await newRecord.save();
    } else {
      await Sale.updateOne(
        {
          _id: existRecord.id,
        },
        req.body
      );
    }

    res.json({
      code: "success",
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra! Vui lòng thử lại",
    });
  }
};
