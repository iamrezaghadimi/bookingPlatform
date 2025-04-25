const express = require("express");
const router = express.Router();
const flightsController = require("../controllers/flightsController");

router.get("/", flightsController.getAllFlights);
router.post("/", flightsController.createFlight);
router.put("/:id", flightsController.updateFlight);
router.patch("/:id", flightsController.updateFlight);
router.delete("/:id", flightsController.deleteFlight);
router.delete("/", flightsController.deleteFlight);
module.exports = router;