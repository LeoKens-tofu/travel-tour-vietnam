const { pathAdmin, paymentMethodList, paymentStatusList, statusList } = require("../../config/variable.config")
const Order = require("../../models/order.model");
const Tour = require("../../models/tours.model");
const AccountAdmin = require("../../models/accounts-admin.model");
const moment = require('moment-timezone');

module.exports.dashboard = async (req, res) => {
  if (!req.permissions.includes("dashboard-view")){
    res.redirect(`/${pathAdmin}/404NOTFOUND`);
    return;
  }

  const orderList = await Order.find({}).sort({ createdAt: "desc" }).limit(10);

  const overView = {
    totalAccount: 0,
    totalOrder: 0,
    totalRevenue: 0,
  }
  // So luong tai khoan admin
  overView.totalAccount = await AccountAdmin.countDocuments({
    deleted: false,
  });
  // End So luong tai khoan admin

  // So luong don hang
  overView.totalOrder = orderList.length;
  // End So luong don hang

  // Doanh thu
  overView.totalRevenue = orderList.reduce((total, item) => total + item.total, 0);
  // End Doanh thu

  // Don hang moi
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
  // End Don hang moi


  res.render('admin/pages/dashboard', {
    title: 'Admin Dashboard',
    orderList: orderList,
    overView: overView,
  })
}

module.exports.revenueChartPost = async (req, res) => {
  try {
    const { curMonth, curYear, previousMonth, previousYear, arrayDate } = req.body;

    // Truy van tat ca don hang trong thang hien tai
    const orderCurrentMonth = await Order.find({
      deleted: false,
      createdAt: {
        $gte: new Date(curYear, curMonth - 1, 1),
        $lt: new Date(curYear, curMonth, 1)
      }
    })

    // Truy van tat ca don hang trong thang truoc
    const orderPreviousMonth = await Order.find({
      deleted: false,
      createdAt: {
        $gte: new Date(previousYear, previousMonth - 1, 1),
        $lt: new Date(previousYear, previousMonth, 1)
      }
    })

    // Tao mang doanh thu theo tung ngay
    const dataCurrentMonth = [];
    const dataPreviousMonth = [];

    for (const day of arrayDate) {
      // Tinh doanh thu theo ngay cua thang hien tai
      let currentRevenue = 0;
      for (const order of orderCurrentMonth) {
        const orderDate = new Date(order.createdAt).getDate();
        if (orderDate == day) {
          currentRevenue += order.total;
        }
      }
      dataCurrentMonth.push(currentRevenue);

      // Tinh doanh thu theo ngay cua thang truoc
      let previousRevenue = 0;
      for (const order of orderPreviousMonth) {
        const orderDate = new Date(order.createdAt).getDate();
        if (orderDate == day) {
          previousRevenue += order.total;
        }
      }
      dataPreviousMonth.push(previousRevenue);
    }

    res.json({
      code: "success",
      message: "Thành công!",
      dataCurrentMonth: dataCurrentMonth,
      dataPreviousMonth: dataPreviousMonth
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi!"
    })
  }
}