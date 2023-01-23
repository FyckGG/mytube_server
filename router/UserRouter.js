const { Router } = require("express");
const UserController = require("../controllers/UserController");
const authenticateToken = require("../middleware/authenticateToken.js");

const router = new Router();

router.post("/registration", UserController.registration);

router.post("/autorization", UserController.autorization);
router.get("/activate/:link", UserController.activate);
router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.post(
  "/get-req-for-change-password",
  UserController.get_request_for_change_password
);
router.get("/getall", authenticateToken, UserController.getAll);
module.exports = router;
