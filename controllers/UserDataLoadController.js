const UserDataLoadService = require("./../service/userDataLoadService");

class UserDataLoadController {
  async findAvatar(req, res, next) {
    try {
      const { id } = req.body;

      const result = await UserDataLoadService.findAvatar(id);
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
  async loadUserVideos(req, res, next) {
    try {
      const { user_id } = req.body;
      const result = await UserDataLoadService.loadUserVideos(user_id);
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async loadUserStats(req, res) {
    try {
      const { user_id } = req.body;
      const result = await UserDataLoadService.loadUserStats(user_id);
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async loadUser(req, res) {
    try {
      const { user_id } = req.body;
      const result = await UserDataLoadService.loadUser(user_id);
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async loadSub(req, res) {
    try {
      const { channel_id, subscriber_id } = req.body;
      const result = await UserDataLoadService.getSub(
        channel_id,
        subscriber_id
      );
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async get_channel_status(req, res) {
    try {
      const { user_id, video_id } = req.body;
      const result = await UserDataLoadService.getChannelStatus(
        user_id,
        video_id
      );
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new UserDataLoadController();
