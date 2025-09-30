const Category = require("../models/category.model");

const getCategoryId = async (parentId) => {
  let result = [];

  const childList = await Category.find({
    status: "active",
    deleted: false,
    parent: parentId,
  })

  for (const item of childList) {
    result.push({
      id: item.id,
      name: item.name
    })
    await getCategoryId(item.id)
    const children = await getCategoryId(item.id);
    result = result.concat(children);
  }
  return result;
}

module.exports.getCategoryId = getCategoryId;