const { Router } = require("express");
const VideoStatsController = require("./../controllers/VideoStatsController");

const router = new Router();

router.post("/add-view", VideoStatsController.add_view);

module.exports = router;
