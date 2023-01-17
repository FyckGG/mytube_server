const { Router } = require("express");
const VideoDataLoadController = require("../controllers/VideoDataLoadController");
const authenticateToken = require("../middleware/authenticateToken.js");

const router = new Router();

router.post(
  "/get-video-for-edit",
  authenticateToken,
  VideoDataLoadController.get_video_for_edit
);

module.exports = router;
