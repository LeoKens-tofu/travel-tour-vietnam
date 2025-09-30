const Contact = require("../../models/contact.model");
const moment = require("moment-timezone");

module.exports.list = async (req, res) => {
  const contactList = await Contact.find({
    deleted: false,
  })

  for (let item of contactList) {
      item.createByTimeFormat = moment(item.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .format("HH:mm - DD/MM/YYYY");
    }

  res.render('admin/pages/contact-list', {
    title: 'Contact List',
    contactList: contactList
  })
}