const jwt = require("jsonwebtoken");
const ApiError = require("./../exceptions/apiError");
const { secret } = require("../config.js");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        throw ApiError.UnautorizedError();
      }
      req.user = user;
      next();
    });
  } else {
    throw ApiError.UnautorizedError();
  }
};

module.exports = authenticateToken;
