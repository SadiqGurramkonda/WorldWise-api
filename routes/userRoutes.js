const express = require("express");
const router = express.Router();
const rateLimitter = require("express-rate-limit");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const limittter = rateLimitter({
  windowMs: 10 * 1000,
  limit: 10,
  legacyHeaders: true,
});


router.route("/getuser").get(authController.protect,authController.getUser)
router.route("/signup").post(authController.signup);
router.route("/login").post(limittter,authController.login);
router.route("/logout").post(limittter,authController.logout);
router.route("/").get(authController.protect, authController.restrictTo("admin"),userController.getAllUsers);



module.exports = router