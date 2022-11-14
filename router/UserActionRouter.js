const { Router } = require("express");
const fileMiddleWare = require("../middleware/uploadVideo");
const UserActionController = require("./../controllers/UserActionController");

const router = new Router();

router.post("/add-video", UserActionController.addNewVideo);
router.post(
  "/upload-video",
  fileMiddleWare.single("video"),
  UserActionController.upload_video
);
// router.post(
//   "/create-video-thumbnail",
//   UserActionController.create_video_thumbnail
// );
router.post(
  "/create-video-thumbnail",
  UserActionController.create_video_thumbnail
);
module.exports = router;