const { Router } = require("express");
const DataLoadController = require("./../controllers/DataLoadController");

const router = new Router();

router.post("/get-comments", DataLoadController.loadComments);

module.exports = router;
