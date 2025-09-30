const buildTree = require("../../helpers/tree.helper");
const Category = require("../../models/category.model");
module.exports.list = async (req, res, next) => {
  
  let categoryList = await Category.find({
    deleted: false,
    status: "active",
  })
  .sort({
    position: "desc",
  });

  categoryList = buildTree(categoryList, "");

  res.locals.categoryList = categoryList;

  next();
}