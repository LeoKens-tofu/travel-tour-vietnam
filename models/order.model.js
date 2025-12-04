const e = require("express");
const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    code: String,
    fullName: String,
    phone: String,
    email: String,
    note: String,
    items: Array,
    total: Number,
    paymentMethod: String,
    paymentStatus: String,
    status: String,
    updatedBy: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: String,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", schema, "orders");

module.exports = Order;
