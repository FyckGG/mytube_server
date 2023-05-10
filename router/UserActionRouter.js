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
router.post("/subscribe", authenticateToken, UserActionController.subscribe);
router.post(
  "/unsubscribe",
  authenticateToken,
  UserActionController.unsubscribe
);
router.post(
  "/add-watch-later",
  authenticateToken,
  UserActionController.add_to_watch_later
);
router.post(
  "/delete-watch-later",
  authenticateToken,
  UserActionController.delete_watch_later
);
router.post(
  "/delete-comment",
  authenticateToken,
  UserActionController.delete_comment
);

router.post("/edit-video", authenticateToken, UserActionController.edit_video);
router.post("/edit-tags", authenticateToken, UserActionController.edit_tags);

router.post(
  "/delete-video",
  authenticateToken,
  UserActionController.delete_video
);

router.post(
  "/send-complaint",
  authenticateToken,
  UserActionController.send_complaint
);

router.post(
  "/send-video-complaint",
  authenticateToken,
  UserActionController.send_video_complaint
);

module.exports = router;
