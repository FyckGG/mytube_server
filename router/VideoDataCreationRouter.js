const { Router } = require("express");
const authenticateToken = require("./../middleware/authenticateToken");
const VideoDataCreationController = require("../controllers/VideoDataCreationController");

const router = new Router();

router.post(
  "/save-tags",
  authenticateToken,
  VideoDataCreationController.save_tokens
);

module.exports = router;
