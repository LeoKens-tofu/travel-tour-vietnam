const jwt = require('jsonwebtoken');
const AccountAdmin = require('../models/accounts-admin.model');
module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { id, email, count } = decoded;

    const existAccount = await AccountAdmin.findOne({
      _id: id,
      email: email,
      count: count,
      status: 'active'
    })

    if (!existAccount || existAccount.count !== count) {
      res.clearCookie('token');
      return res.redirect(`/${pathAdmin}/account/login`);
    }

    req.account = existAccount;

    res.locals.account = existAccount;

    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect(`/${pathAdmin}/account/login`);
  }
}