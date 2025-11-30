const City = require("../../models/city.model");
const Tour = require("../../models/tours.model");
const moment = require("moment-timezone");

module.exports.cart = (req, res) => {
  res.render("client/pages/cart", {
    title: "Cart Page",
  });
};

module.exports.detail = async (req, res) => {
  try {
    const cityList = await City.find({});
    let cart = [];
    for (const item of req.body) {
      const tourDetail = await Tour.findOne({
        _id: item.tourId,
        status: "active",
        deleted: false,
      });

      const cityInfo = cityList.find(
        (city) => city._id.toString() === item.locationFrom
      );
      let cityName = "";
      if (cityInfo) {
        cityName = cityInfo.name;
      }
      if (tourDetail) {
        if (tourDetail.departureDate) {
          tourDetail.departureDateFormat = moment(tourDetail.departureDate)
            .tz("Asia/Ho_Chi_Minh")
            .format("DD/MM/YYYY");
        }
        cart.push({
          tourId: item.tourId,
          locationFrom: item.locationFrom,
          quantityAdult: item.quantityAdult,
          quantityChildren: item.quantityChildren,
          quantityBaby: item.quantityBaby,
          checked: item.checked,
          name: tourDetail.name,
          avatar: tourDetail.avatar,
          departureDate: tourDetail.departureDateFormat,
          cityName: cityName,
          stockAdult: tourDetail.stockAdult,
          stockChildren: tourDetail.stockChildren,
          stockBaby: tourDetail.stockBaby,
          priceNewAdult: tourDetail.priceNewAdult,
          priceNewChildren: tourDetail.priceNewChildren,
          priceNewBaby: tourDetail.priceNewBaby,
          slug: tourDetail.slug,
        });
      }
    }

    res.json({
      code: "success",
      message: "OK!",
      cart: cart,
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Error retrieving cart details",
    });
  }
};
