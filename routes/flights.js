const express = require("express");
const router = express.Router();
const flightsController = require("../controllers/flightsController");
const auth = require("../middlewares/auth")

router.get("/", auth(['admin', 'get_one_flight']),flightsController.getAllFlights);
router.post("/", auth(['admin', 'staff_l1']), flightsController.createFlight);
router.put("/:id", flightsController.updateFlight);
router.patch("/:id", flightsController.updateFlight);
router.delete("/:id", flightsController.deleteFlight);
router.delete("/", flightsController.deleteFlight);
module.exports = router;