const mongoose = require("mongoose");

const schema = mongoose.Schema({
  websiteName: String,
  phone: String,
  email: String,
  address: String,
  logo: String,
  favicon: String,
});

const WebInfo = mongoose.model("WebInfo", schema, "web-info");

module.exports = WebInfo;
