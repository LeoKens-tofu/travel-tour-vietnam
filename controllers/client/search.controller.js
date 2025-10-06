const City = require("../../models/city.model");
const Tour = require("../../models/tours.model");
const toSlugVi = require("../../helpers/slugify.helper");
const moment = require("moment-timezone");

module.exports.list = async (req, res) => {
  const cityList = await City.find({}).sort({ name: "asc" });

  const find = {
    status: "active",
    deleted: false,
  };
  //Location From
  if (req.query.locationFrom) {
    find.locations = req.query.locationFrom;
  }
  //End Location From

  //Location To
  if (req.query.locationTo) {
    const locationTo = toSlugVi(req.query.locationTo);
    const locationToRegex = new RegExp(locationTo, "i");
    console.log(locationTo);
    find.slug = locationToRegex;
  }
  //Location To

  //Departura Date
  if (req.query.departureDate) {
    const departureDate = new Date(req.query.departureDate);
    find.departureDate = departureDate;
  }
  //End Departura Date

  //Stock Adult
  if (req.query.stockAdult) {
    find.stockAdult = {
      $gte: parseInt(req.query.stockAdult),
    };
  }
  //End Stock Adult

  //Stock Child
  if (req.query.stockChild) {
    find.stockChildren = {
      $gte: parseInt(req.query.stockChild),
    };
  }
  //End Stock Child

  //Stock Baby
  if (req.query.stockBaby) {
    find.stockBaby = {
      $gte: parseInt(req.query.stockBaby),
    };
  }
  //End Stock Baby

  //Filter Price
  let priceFilter = {};

  if (req.query.minPrice && req.query.maxPrice) {
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);

    priceFilter.$gte = minPrice;
    priceFilter.$lte = maxPrice;
  }

  if (Object.keys(priceFilter).length > 0) {
    find.priceNewAdult = priceFilter;
  }
  //End Filter Price

  const tourList = await Tour.find(find).sort({
    position: "desc",
  });

  for (const item of tourList) {
    item.departureDateFormat = moment(item.departureDate)
      .tz("Asia/Ho_Chi_Minh")
      .format("DD/MM/YYYY");
    item.discount = Math.floor(
      ((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100
    );
  }

  res.render("client/pages/search", {
    title: "Kết quả tìm kiếm",
    cityList: cityList,
    tourList: tourList,
  });
};
