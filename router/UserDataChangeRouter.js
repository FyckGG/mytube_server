const { Router } = require("express");
const authenticateToken = require("./../middleware/authenticateToken");
const fileMiddleWare = require("./../middleware/uploadProfileImg");
const UserDataChangeController = require("./../controllers/UserDataChangeController");

const router = new Router();

router.post(
  "/change-avatar",
  authenticateToken,
  fileMiddleWare.single("avatar"),
  UserDataChangeController.change_avatar
);

router.post(
  "/change-channel-description",
  authenticateToken,
  UserDataChangeController.change_description
);

module.exports = router;
