const mongoose = require('mongoose');

const AccountAdmin = mongoose.model('AccountAdmin', {
  fullName: String,
  email: String,
  password: String,
  status: String,
  count: {
    type: Number,
    default: 0
  }
}, "accounts-admin");
module.exports = AccountAdmin;