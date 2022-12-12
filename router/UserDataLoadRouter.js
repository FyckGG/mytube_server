const { Router } = require("express");
const UserDataLoadController = require("../controllers/UserDataLoadController");

const router = new Router();

router.post("/get-avatar", UserDataLoadController.findAvatar);
router.post("/get-user-videos", UserDataLoadController.loadUserVideos);
router.post("/get-user-stats", UserDataLoadController.loadUserStats);
module.exports = router;
