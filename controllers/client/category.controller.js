const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const Tour = require("../../models/tours.model");
const City = require("../../models/city.model");
const moment = require("moment-timezone");

module.exports.list = async (req, res) => {
  try {
    const slug = req.params.slug;

    const categoryDetail = await Category.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    if (!categoryDetail) {
      res.redirect("/");
    }

    const breadcrumb = [];

    if (categoryDetail.parent) {
      const categoryParent = await Category.findOne({
        _id: categoryDetail.parent,
        deleted: false,
        status: "active",
      });

      if (categoryParent) {
        breadcrumb.push({
          slug: categoryParent.slug,
          name: categoryParent.name,
          avatar: categoryParent.avatar,
        });
      }
    }

    breadcrumb.push({
      slug: categoryDetail.slug,
      name: categoryDetail.name,
      avatar: categoryDetail.avatar,
    });

    const categoryId = categoryDetail.id;

    const categoryListChild = await categoryHelper.getCategoryId(categoryId);

    const categoryListIdChild = categoryListChild.map((item) => item.id);

    const tourList = await Tour.find({
      category: { $in: [categoryId, ...categoryListIdChild] },
      deleted: false,
      status: "active",
    })
      .sort({
        position: "desc",
      })
      .limit(8);

    for (const item of tourList) {
      item.departureDateFormat = moment(item.departureDate)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY");
      item.discount = Math.floor(
        ((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100
      );
    }

    const cityList = await City.find({}).sort({ name: "asc" });

    res.render("client/pages/list", {
      title: categoryDetail.name,
      breadcrumb: breadcrumb,
      categoryDetail: categoryDetail,
      tourList: tourList,
      cityList: cityList,
    });
  } catch (error) {
    console.log(error);
  }
};
