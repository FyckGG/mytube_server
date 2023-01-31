const { Router } = require("express");

const DataLoadController = require("./../controllers/DataLoadController");
const authenticateToken = require("./../middleware/authenticateToken");

const router = new Router();

router.post("/get-comments", DataLoadController.loadComments);
router.post("/get-videos", DataLoadController.load_videos);
router.post("/get-filtered-content", DataLoadController.load_filtered_content);
router.post(
  "/get-subscriptions-videos",
  authenticateToken,
  DataLoadController.load_subscriptions_videos
);
router.post("/get-videos-by-subject", DataLoadController.get_subject_videos);

module.exports = router;
