const { Router } = require("express");
const authenticateToken = require("./../middleware/authenticateToken");
const isUserActivated = require("./../middleware/isUserActivated");
const fileMiddleWare = require("../middleware/uploadVideo");
const UserActionController = require("./../controllers/UserActionController");

const router = new Router();

router.post("/add-video", UserActionController.addNewVideo);
router.post(
  "/upload-video",
  authenticateToken,
  //isUserActivated,
  fileMiddleWare.single("video"),
  UserActionController.upload_video
);
router.post(
  "/create-video-thumbnail",
  UserActionController.create_video_thumbnail
);
router.post("/load-watch-video", UserActionController.load_video_for_watch);
router.post(
  "/send-comment",
  authenticateToken,
  UserActionController.send_comment
);
router.post("/subscribe", UserActionController.subscribe);
module.exports = router;
