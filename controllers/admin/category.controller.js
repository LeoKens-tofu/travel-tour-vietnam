const buildTree = require("../../helpers/tree.helper");
const Category = require("../../models/category.model")


module.exports.list = (req, res) => {
  res.render('admin/pages/category-list', {
    title: 'Category List'
  })
}

module.exports.create = async (req, res) => {
  let categoryList = await Category.find({
    deleted:false
  });

  categoryList = buildTree(categoryList, "");

  res.render('admin/pages/category-create', {
    title: 'Category Create',
    categoryList: categoryList
  })
}

module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const total = await Category.countDocuments({});
    req.body.position = total + 1;
  }

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  const newCategory = new Category(req.body);
  await newCategory.save();

  res.json({
    code:'success',
    message:'Tạo category thành công!'
  })
}