const { Router } = require("express");
const VideoStatsController = require("./../controllers/VideoStatsController");
const authenticateToken = require("../middleware/authenticateToken.js");

const router = new Router();

router.post("/add-view", VideoStatsController.add_view);
router.post("/add-mark", authenticateToken, VideoStatsController.add_mark);

router.post(
  "/delete-mark",
  authenticateToken,
  VideoStatsController.delete_mark
);

module.exports = router;
