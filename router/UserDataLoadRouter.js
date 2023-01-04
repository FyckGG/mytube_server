const { Router } = require("express");
const authenticateToken = require("./../middleware/authenticateToken");
const UserDataLoadController = require("../controllers/UserDataLoadController");

const router = new Router();

router.post("/get-avatar", UserDataLoadController.findAvatar);
router.post("/get-user-videos", UserDataLoadController.loadUserVideos);
router.post("/get-user-stats", UserDataLoadController.loadUserStats);
router.post("/get-user", UserDataLoadController.loadUser);
router.post("/get-sub", authenticateToken, UserDataLoadController.loadSub);
router.post("/get-channel-status", UserDataLoadController.get_channel_status);
router.post(
  "/get-liked-videos",
  authenticateToken,
  UserDataLoadController.get_liked_videos
);
router.post(
  "/get-subs-channels",
  authenticateToken,
  UserDataLoadController.get_subs_channels
);
module.exports = router;
