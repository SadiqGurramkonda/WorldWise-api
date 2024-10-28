const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
const authController = require("../controllers/authController");


router.route("/").post( authController.protect,cityController.createCity)
.get(authController.protect, cityController.getCities)

router.route("/:id").delete(authController.protect, cityController.deleteCity);
module.exports = router