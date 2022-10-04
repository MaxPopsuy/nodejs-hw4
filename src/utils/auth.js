const jwt = require("jsonwebtoken");

exports.generateToken = async (user, time) => {
  const payload = {
    _id: user._id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: time,
  });
};
exports.isExistent = async (user, email) => {
  const existingUser = await user.findOne({
    email: email,
  });
  console.log(existingUser)
  if (existingUser) {
    console.log("worked")
    return true;
  }
  return false;
};

