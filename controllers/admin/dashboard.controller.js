const { pathAdmin } = require("../../config/variable.config")

module.exports.dashboard = (req, res) => {
  if (!req.permissions.includes("dashboard-view")){
    res.redirect(`/${pathAdmin}/404NOTFOUND`);
    return;
  }
  res.render('admin/pages/dashboard', {
    title: 'Admin Dashboard',
  })
}