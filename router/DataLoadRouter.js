const { Router } = require("express");
const DataLoadController = require("./../controllers/DataLoadController");

const router = new Router();

router.post("/get-comments", DataLoadController.loadComments);
router.get("/get-videos", DataLoadController.load_videos);

module.exports = router;
