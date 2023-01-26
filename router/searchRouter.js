const { Router } = require("express");
const searchController = require("./../controllers/searchController");

const router = new Router();

router.post("/get-search-results", searchController.get_search_result);

module.exports = router;
