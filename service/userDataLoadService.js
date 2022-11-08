const UserAvatar = require("./../models/UserAvatar");

class TokenService {
  async findAvatar(id) {
    const avatar = await UserAvatar.findOne({
      user: id,
    });
    return avatar;
  }
}

module.exports = new TokenService();
