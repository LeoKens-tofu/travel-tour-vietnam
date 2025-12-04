const {
  paymentMethodList,
  paymentStatusList,
  statusList,
} = require("../../config/variable.config");
const Order = require("../../models/order.model");
const Tour = require("../../models/tours.model");
const City = require('../../models/city.model');
const moment = require("moment-timezone");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
  };

  const orderList = await Order.find(find).sort({ createdAt: "desc" });

  if (orderList) {
    for (const order of orderList) {
      order.paymentMethodName = paymentMethodList.find(
        (item) => item.value == order.paymentMethod
      ).label;
      order.paymentStatusName = paymentStatusList.find(
        (item) => item.value == order.paymentStatus
      ).label;
      order.statusInfo = statusList.find((item) => item.value == order.status);
      order.createdAtTime = moment(order.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .format("HH:mm");
      order.createdAtDate = moment(order.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY");
      for (const item of order.items) {
        const tourInfo = await Tour.findOne({
          _id: item.tourId,
        });

        if (tourInfo) {
          item.name = tourInfo.name;
          item.avatar = tourInfo.avatar;
        }
      }
    }
  }

  res.render("admin/pages/order-list", {
    title: "Order List",
    orderList: orderList,
  });
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const orderDetail = await Order.findOne({
      _id: id,
      deleted: false,
    });

    if (!orderDetail) {
      return res.ridirect(`/${pathAdmin}/order/list`);
    }

    orderDetail.createdAtFormat = moment(orderDetail.createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DDTHH:mm");

    for (const item of orderDetail.items) {
      const tourInfo = await Tour.findOne({
        _id: item.tourId,
      });

      const city = await City.findOne({
        _id: item.locationFrom
      })

      item.cityName = city.name;

      if (tourInfo) {
        item.name = tourInfo.name;
        item.avatar = tourInfo.avatar;
        item.departureDateFormat = moment(tourInfo.departureDate).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
      
      }
    }

    res.render("admin/pages/order-edit", {
      title: `Đơn hàng #${orderDetail.code}`,
      orderDetail: orderDetail,
      paymentMethodList: paymentMethodList,
      paymentStatusList: paymentStatusList,
      statusList: statusList,
    });
  } catch (error) {
    res.ridirect(`/${pathAdmin}/order/list`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const orderDetail = await Order.findOne({
      _id: req.params.id,
    })

    if (!orderDetail) {
      res.json({
        code: "error",
        message: "Đơn hàng không tồn tại!"
      })
    }

    await Order.updateOne({
      _id: req.params.id,
      deleted: false,
    }, req.body);

    res.json({
      code: "success",
      message: "Cập nhật thành công!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi!"
    })
  }
}
