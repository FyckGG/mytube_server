const { Router } = require("express");
const DataLoadController = require("./../controllers/DataLoadController");

const router = new Router();

router.post("/get-comments", DataLoadController.loadComments);
router.post("/get-videos", DataLoadController.load_videos);
router.post("/get-filtered-content", DataLoadController.load_filtered_content);

module.exports = router;
