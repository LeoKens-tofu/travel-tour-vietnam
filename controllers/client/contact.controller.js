const Contact = require("../../models/contact.model");

module.exports.createPost = async (req, res) => {
  try {
    const { email } = req.body;

    const existEmail = await Contact.findOne({
      email: email,
      deleted: false,
    });

    if (existEmail) {
      res.json({
        code: "error",
        message: "Email đã được đăng ký!",
      });
      return;
    }

    const newContact = new Contact({
      email: email
    })

    await newContact.save();

    res.json({
      code: "success",
      message: "Đăng ký thông tin thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra! Vui lòng thử lại",
    });
  }
};
