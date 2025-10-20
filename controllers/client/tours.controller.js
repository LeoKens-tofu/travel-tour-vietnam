const Tour = require("../../models/tours.model");
const Category = require("../../models/category.model");

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const tourDetail = await Tour.findOne({
    slug: slug,
    deleted: false,
    status: "active",
  });

  if (!tourDetail) {
    res.redirect("/");
  }

  const breadcrumb = [];
  if (tourDetail.category) {
    const category = await Category.findOne({
      _id: tourDetail.category,
      deleted: false,
      status: "active",
    });

    if (category) {
      breadcrumb.push({
        slug: category.slug,
        name: category.name,
      });
    }
  }

  breadcrumb.push({
    slug: tourDetail.slug,
    name: tourDetail.name,
    avatar: tourDetail.avatar,
  });


  res.render("client/pages/tour-detail", {
    title: tourDetail.name,
    breadcrumb :breadcrumb,
    tourDetail: tourDetail
  });
};
