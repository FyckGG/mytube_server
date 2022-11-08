const { Router } = require("express");
const UserDataCreationController = require("../controllers/UserDataCreationController");
const fileMiddleWare = require("../middleware/uploadProfileImg");
const router = new Router();

router.post("/create-dir", UserDataCreationController.createDir);
router.post("/create-dir-avatar", UserDataCreationController.createAvatarDir);
router.post("/add-defaut-avatar", UserDataCreationController.addDefaultImg);
router.post(
  "/upload-avatar",
  //fileMiddleWare.single("avatar"),
  fileMiddleWare.single("avatar"),
  UserDataCreationController.upload_avatar
);
router.post("/save-avatar-info", UserDataCreationController.saveAvatarInfo);
module.exports = router;
