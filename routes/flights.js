const express = require("express");
const router = express.Router();
const flightsController = require("../controllers/flightsController");
const auth = require("../middlewares/auth")

router.get("/", auth(['admin', 'flight_get']), flightsController.getAllFlights);
router.post("/", auth(['admin', 'flight_post']), flightsController.createFlight);
router.put("/:id", flightsController.updateFlight);
router.patch("/:id", flightsController.updateFlight);
router.delete("/:id", flightsController.deleteFlight);
router.delete("/", flightsController.deleteFlight);
module.exports = router;