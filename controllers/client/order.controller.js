const generateHelper = require("../../helpers/generate.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tours.model");
const City = require('../../models/city.model');
const moment = require("moment-timezone");
const { paymentMethodList, paymentStatusList, statusList } = require("../../config/variable.config");

module.exports.createPost = async (req, res) => {
  try {
    // Ma don hang
    req.body.code = "OD" + generateHelper.generateRandomNumber(10);
    // End Ma don hang

    req.body.total = 0;

    // Danh sach tour
    for (const item of req.body.items) {
      const itemInfo = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active",
      });

      if (itemInfo) {
        // Them gia
        item.priceNewAdult = itemInfo.priceNewAdult;
        item.priceNewChildren = itemInfo.priceNewChildren;
        item.priceNewBaby = itemInfo.priceNewBaby;

        // Thanh tien
        req.body.total +=
          item.priceNewAdult * item.quantityAdult +
          item.priceNewChildren * item.quantityChildren +
          item.priceNewBaby * item.quantityBaby;

        // Them ngay khoi hanh
        item.departureDate = itemInfo.departureDate;

        // Cap nhat lai so luong tour
        await Tour.updateOne(
          {
            _id: item.tourId,
          },
          {
            stockAdult: itemInfo.stockAdult - item.quantityAdult,
            stockChildren: itemInfo.stockChildren - item.quantityChildren,
            stockBaby: itemInfo.stockBaby - item.quantityBaby,
          }
        );
      }
    }
    // End Danh sach tour

    // Trang thai thanh toan
    req.body.paymentStatus = "unpaid";

    // Trang thai don hang
    req.body.status = "initial";

    // Luu vao CSDL
    const newOrder = new Order(req.body);
    await newOrder.save();

    res.json({
      code: "success",
      message: "Cảm ơn bạn đã đặt hàng!",
      orderCode: req.body.code,
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại!",
    });
  }
};

module.exports.successGet = async (req, res) => {
  const { orderCode, phone } = req.query;

  const orderDetail = await Order.findOne({
    code: orderCode,
    phone: phone,
  });

  if (!orderDetail) {
    return res.redirect("/");
  }

  orderDetail.orderDate = moment(orderDetail.createdAt).tz("Asia/Ho_Chi_Minh").format("HH:mm - DD/MM/YYYY");
  orderDetail.paymentMethodName = paymentMethodList.find(item => item.value == orderDetail.paymentMethod).label;
  orderDetail.paymentStatusName = paymentStatusList.find(item => item.value == orderDetail.paymentStatus).label;
  orderDetail.statusName = statusList.find(item => item.value == orderDetail.status).label;

  const cityList = await City.find({});
  let tourList = [];

  for (const item of orderDetail.items) {
    const tourInfo = await Tour.findOne({
      _id: item.tourId,
    });
    if (tourInfo) {
      const locationFromName = cityList.find(city => city._id.toString() == item.locationFrom).name;
      const departureDateFormat = moment(tourInfo.departureDate).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
      tourList.push({
        tourId: item.tourId,
        locationFromName: locationFromName,
        departureDateFormat: departureDateFormat,
        quantityAdult: item.quantityAdult,
        quantityChildren: item.quantityChildren,
        quantityBaby: item.quantityBaby,
        priceNewAdult: item.priceNewAdult,
        priceNewChildren: item.priceNewChildren,
        priceNewBaby: item.priceNewBaby,
        name: tourInfo.name,
        avatar: tourInfo.avatar,
        slug: tourInfo.slug,
      })
    }
  }

  res.render("client/pages/order-success", {
    title: "Đặt hàng thành công",
    orderDetail: orderDetail,
    tourList: tourList
  });
};
