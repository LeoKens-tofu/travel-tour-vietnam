const slugify = require("slugify");

const toSlugVi = (text) => {
  if (!text) return "";
  return slugify(
    text
      .replace(/Đ/g, "D")
      .replace(/đ/g, "d"),
    {
      lower: true,
      locale: "vi",
      remove: /[*+~.()'"!:@]/g,
      strict: true,
      trim: true,
    }
  );
}

module.exports = toSlugVi;
