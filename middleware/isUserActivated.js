const User = require("../models/User.js");

const isUserActivated = async (req, res, next) => {
  const { id } = req.user.id;
  const user = await User.findOne({ id });
  if (!user.isActivated) throw new Error("Пользователь не активировал почту.");
  next();
};

module.exports = isUserActivated;
