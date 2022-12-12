const DataLoadService = require("./../service/dataLoadService");

class DataLoadController {
  async loadComments(req, res, next) {
    try {
      const { video_id } = req.body;
      const result = await DataLoadService.loadComments(video_id);
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }
}

module.exports = new DataLoadController();