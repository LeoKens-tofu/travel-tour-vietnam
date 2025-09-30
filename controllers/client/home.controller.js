const Sale = require("../../models/sale.model");
const Tour = require("../../models/tours.model");
const moment = require("moment-timezone");
const categoryHelper = require("../../helpers/category.helper");
const Category = require("../../models/category.model");

module.exports.home = async (req, res) => {
  const sale = await Sale.findOne({});

  const saleTour = await Tour.find({
    _id: { $in: sale.saleTour },
    deleted: false,
  }).sort({
    position: "desc",
  });

  for (const item of saleTour) {
    item.departureDateFormat = moment(item.departureDate)
      .tz("Asia/Ho_Chi_Minh")
      .format("DD/MM/YYYY");
    item.discount = Math.floor(
      ((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100
    );
  }

  const categoryIdSection4 = "68d55219870fd785c102bf94";

  const categorySection4 = await Category.findOne({
    _id: categoryIdSection4,
    status: "active",
    deleted: false,
  });

  const  categoryListChild = await categoryHelper.getCategoryId(
    categoryIdSection4
  );

  const categoryListIdChild = categoryListChild.map(item => item.id);

  let tourListSection4 = [];

  if (categorySection4) {
    tourListSection4 = await Tour.find({
      category: { $in: [categoryIdSection4, ...categoryListIdChild] },
      deleted: false,
      status: "active",
    })
      .sort({
        position: "desc",
      })
      .limit(8);

    for (const item of tourListSection4) {
      item.departureDateFormat = moment(item.departureDate)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY");
      item.discount = Math.floor(
        ((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100
      );
    }
  }

  res.render("client/pages/home", {
    title: "Home Page",
    sale: sale,
    saleTour: saleTour,
    tourListSection4: tourListSection4,
    categorySection4: categorySection4
  });
};
