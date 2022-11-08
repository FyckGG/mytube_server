const { Router } = require("express");
const UserDataLoadController = require("../controllers/UserDataLoadController");

const router = new Router();

router.post("/get-avatar", UserDataLoadController.findAvatar);

module.exports = router;
