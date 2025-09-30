const WebInfo = require("../../models/web-info.model");
const Sale = require("../../models/sale.model");

module.exports.webInfo = async (req, res, next) => {
  const info = await WebInfo.findOne({});

  res.locals.WebInfo = info;
  
  next();
}