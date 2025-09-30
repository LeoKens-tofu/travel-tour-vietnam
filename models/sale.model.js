const mongoose = require("mongoose");

const schema = mongoose.Schema({
  saleName: String,
  endDate: Date,
  salePrice: Number,
  saleTour: Array,
});

const Sale = mongoose.model("Sale", schema, "sales");

module.exports = Sale;
