const { Router } = require("express");
const fileMiddleWare = require("../middleware/uploadVideo");
const UserActionController = require("./../controllers/UserActionController");

const router = new Router();

router.post(
  "/add-video",
  fileMiddleWare.single("video"),
  UserActionController.addNewVideo
);

module.exports = router;
