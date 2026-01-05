const generateHelper = require("../../helpers/generate.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tours.model");
const City = require("../../models/city.model");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment-timezone");
const {
  paymentMethodList,
  paymentStatusList,
  statusList,
} = require("../../config/variable.config");
const { sortObject } = require("../../helpers/sort.helper");

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

  orderDetail.orderDate = moment(orderDetail.createdAt)
    .tz("Asia/Ho_Chi_Minh")
    .format("HH:mm - DD/MM/YYYY");
  orderDetail.paymentMethodName = paymentMethodList.find(
    (item) => item.value == orderDetail.paymentMethod
  ).label;
  orderDetail.paymentStatusName = paymentStatusList.find(
    (item) => item.value == orderDetail.paymentStatus
  ).label;
  orderDetail.statusName = statusList.find(
    (item) => item.value == orderDetail.status
  ).label;

  const cityList = await City.find({});
  let tourList = [];

  for (const item of orderDetail.items) {
    const tourInfo = await Tour.findOne({
      _id: item.tourId,
    });
    if (tourInfo) {
      const locationFromName = cityList.find(
        (city) => city._id.toString() == item.locationFrom
      ).name;
      const departureDateFormat = moment(tourInfo.departureDate)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY");
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
      });
    }
  }

  res.render("client/pages/order-success", {
    title: "Đặt hàng thành công",
    orderDetail: orderDetail,
    tourList: tourList,
  });
};

module.exports.paymentZaloPay = async (req, res) => {
  try {
    const { orderCode, phone } = req.query;

    const orderDetail = await Order.findOne({
      code: orderCode,
      phone: phone,
    });

    if (!orderDetail) {
      return res.redirect("/");
    }

    // APP INFO
    const config = {
      app_id: process.env.ZALOPAY_APPID,
      key1: process.env.ZALOPAY_KEY1,
      key2: process.env.ZALOPAY_KEY2,
      endpoint: process.env.ZALOPAY_DOMAIN,
    };

    const embed_data = {
      redirecturl: `${process.env.WEBSITE_DOMAIN}/order/success?orderCode=${orderCode}&phone=${phone}`,
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: `${phone}-${orderCode}`,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: orderDetail.total,
      description: `Thanh toán đơn hàng ${orderCode}`,
      bank_code: "",
      callback_url:
        `${process.env.WEBSITE_DOMAIN}/order/payment-zalopay-result`,
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });
    console.log(response.data.order_url);
    if (response.data.return_code == 1) {
      res.redirect(response.data.order_url);
    }
    res.send("OK");
  } catch (error) {}
};

module.exports.paymentZaloPayResult = async (req, res) => {
  const config = {
    key2: process.env.ZALOPAY_KEY2,
  };

  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      const [phone, orderCode] = dataJson.app_user.split("-");
      await Order.updateOne({
        phone: phone,
        code: orderCode,
      }, {
        paymentStatus: "paid"
      })

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};

module.exports.paymentVNPay = async (req, res) => {
  const { orderCode, phone } = req.query;

  const orderDetail = await Order.findOne({
    code: orderCode,
    phone: phone,
  });

  if (!orderDetail) {
    return res.redirect("/");
  }

  let date = new Date();
  let createDate = moment(date).utcOffset(7).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = "AJ7HN3EC";
  let secretKey = "L69R0Y2H1B11QUEQI2YPWL19RI7H47UR";
  let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  let returnUrl = `${process.env.WEBSITE_DOMAIN}/order/payment-vnpay-result`;
  let orderId = `${phone}-${orderCode}-${Date.now()}`;
  let amount = orderDetail.total;
  let bankCode = "";

  let locale = "vn";
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  res.redirect(vnpUrl);
};

module.exports.paymentVNPayResult = async (req, res) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = "L69R0Y2H1B11QUEQI2YPWL19RI7H47UR";
  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    if (
      vnp_Params["vnp_TransactionStatus"] == "00" &&
      vnp_Params["vnp_ResponseCode"] == "00"
    ) {
      const [phone, orderCode] = vnp_Params["vnp_TxnRef"].split("-");
      await Order.updateOne(
        {
          phone: phone,
          code: orderCode,
        },
        {
          paymentStatus: "paid",
        }
      );
      res.redirect(
        `${process.env.WEBSITE_DOMAIN}/order/success?orderCode=${orderCode}&phone=${phone}`
      );
    }
  } else {
    res.redirect("/");
  }
};

