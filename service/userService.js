const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const UserStatistic = require("./../models/UserStatistic");
const jwt = require("jsonwebtoken");
const { secret } = require("./../config");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/userDto.js");
const ApiError = require("./../exceptions/apiError");
const MailService = require("./mailService");
const mailService = require("./mailService");
const uuid = require("uuid");

// const generateAccesToken = (id, em_log) => {
//   const payload = { userId: id, em_log: em_log };
//   return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "1h" });
// };

class UserServices {
  async registration(email, login, password, img_profile) {
    const candidate_by_email = await User.findOne({ email });
    const candidate_by_login = await User.findOne({ login });

    if (candidate_by_email) {
      throw ApiError.BadRequest(`Email ${email} уже привязан.`);
      //return "Привязан";
    }
    if (candidate_by_login) {
      throw ApiError.BadRequest(`Login ${login} уже существует.`);
    }

    const activationLink = uuid.v4();
    const hashpassword = bcrypt.hashSync(password, 7);
    const user = await User.create({
      email,
      login,
      password: hashpassword,
      activationLink,
      img_profile,
    });
    const user_stat = await UserStatistic.create({
      user: user._id,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/users/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async authorization(em_log, password) {
    var user = await User.findOne({ email: em_log });
    if (!user) user = await User.findOne({ login: em_log });
    if (!user) throw ApiError.BadRequest("Несуществующий пользователь.");
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) throw ApiError.BadRequest("Неверный пароль.");
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Некорректная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }

  async logout(refreshToken) {
    const token = await tokenService.deleteToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    //console.log("service");
    if (!refreshToken) throw ApiError.UnautorizedError();
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) throw ApiError.UnautorizedError();
    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAll() {
    const all = await User.find();
    return all;
  }
}
module.exports = new UserServices();
