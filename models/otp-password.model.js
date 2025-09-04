const mongoose = require('mongoose');

const schema = mongoose.Schema({
  email: String,
  otp: String,
  expireAt: {
    type: Date,
    expires: 0
  }
},
  {
    timestamps: true
  }
)

const OTPPassword = mongoose.model('OTPPassword', schema, "otp-password");

module.exports = OTPPassword;