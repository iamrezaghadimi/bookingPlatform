const express = require("express");
const router = express.Router();
const hotelsController = require("../controllers/hotelsController");
const { body } = require("express-validator");

// Validation rules for hotel data
const validateHotelData = [

];
// Hotel routes
router.get("/", hotelsController.getAllHotels);
router.post("/", validateHotelData, hotelsController.createHotel);
router.put("/:id", validateHotelData, hotelsController.updateHotel);
router.patch("/:id", validateHotelData, hotelsController.updateHotel);
router.delete("/:id", hotelsController.deleteHotel);

module.exports = router;