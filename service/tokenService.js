const jwt = require("jsonwebtoken");
const { secret } = require("./../config");
const Token = require("./../models/Token");
const ResetToken = require("./../models/ResetToken");

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  generateResetToken(payload) {
    const resetToken = jwt.sign(payload, process.env.JWT_RESET_SECRET, {
      //expiresIn: "60m",
      expiresIn: "60m",
    });
    return resetToken;
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({
      user: userId,
      refreshToken: refreshToken,
    });
    return token;
  }

  async saveResetToken(userId, resetToken) {
    const tokenData = await ResetToken.findOne({ user: userId });
    if (tokenData) {
      tokenData.resetToken = resetToken;
      return tokenData.save();
    }
    const token = await ResetToken.create({
      user: userId,
      resetToken: resetToken,
    });
    return token;
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const token = await Token.findOne({ refreshToken });
    return token;
  }

  async deleteToken(refreshToken) {
    const token = await Token.deleteOne({ refreshToken });
    return token;
  }
}

module.exports = new TokenService();
