module.exports.generateRandomNumber = (length) => {
  const numString = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += numString.charAt(Math.floor(Math.random() * numString.length));
  }
  return result;
}