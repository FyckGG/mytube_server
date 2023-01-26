const searchService = require("./../service/searchService");

class VideoDataLoadController {
  async get_search_result(req, res) {
    try {
      const { search_string } = req.body;
      const result = await searchService.getSearchResults(search_string);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new VideoDataLoadController();
