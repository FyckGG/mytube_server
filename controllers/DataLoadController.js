const DataLoadService = require("./../service/dataLoadService");

class DataLoadController {
  async loadComments(req, res, next) {
    try {
      const { video_id, comment_count } = req.body;

      const result = await DataLoadService.loadComments(
        video_id,
        comment_count
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }

  async load_videos(req, res) {
    try {
      const { user } = req.body;
      console.log(user);
      const result = await DataLoadService.loadVideos(user);
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }

  async load_filtered_content(req, res) {
    try {
      const { user_id, search_string, current_page } = req.body;
      const result = await DataLoadService.loadFilteredContent(
        user_id,
        search_string,
        current_page
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }

  async load_subscriptions_videos(req, res) {
    try {
      const { user_id, current_page } = req.body;
      const result = await DataLoadService.loadSubscriptionsVideos(
        user_id,
        current_page
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }
}

module.exports = new DataLoadController();
