const mongoose = require('mongoose');

const AccountAdmin = mongoose.model('AccountAdmin', {
  fullName: String,
  email: String,
  password: String,
  status: String
}, "accounts-admin");
module.exports = AccountAdmin;