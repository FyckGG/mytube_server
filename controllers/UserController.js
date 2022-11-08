const User = require("../models/User.js");
const userService = require("./../service/userService");

const UserService = require("./../service/userService");

class UserController {
  async registration(req, res, next) {
    try {
      const { email, login, password, img_profile } = req.body;
      const user = await UserService.registration(
        email,
        login,
        password,
        img_profile
      );
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(user);
    } catch (e) {
      //next(e);
      res.status(400).send({ error: e.message });
    }
  }

  async autorization(req, res, next) {
    try {
      const { em_log, password } = req.body;
      const result = await UserService.authorization(em_log, password);
      res.cookie("refreshToken", result.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(result);
    } catch (e) {
      console.log("Ошибка поймана в контроллере");
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
      return res.json({ message: "ok" });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      //console.log(refreshToken);
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res) {
    try {
      const all = await UserService.getAll();
      return res.json(all);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Not autoriz" });
    }
  }
}

module.exports = new UserController();
