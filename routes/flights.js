const express = require("express");
const router = express.Router();
const flightsController = require("../controllers/flightsController");
const { body } = require("express-validator");

// Validation rules for flight data
const validateFlightData = [
    body("destination")
        .custom((value, { req }) => {
            // Make destination optional for PATCH
            if (req.method === "PATCH" && value === undefined) {
                return true; // Skip validation if field is not provided in PATCH
            }
            if (typeof value !== "string") {
                throw new Error("Destination must be a string");
            }
            return true;
        }),
    body("price")
        .custom((value, { req }) => {
            // Make price optional for PATCH
            if (req.method === "PATCH" && value === undefined) {
                return true; // Skip validation if field is not provided in PATCH
            }
            if (typeof value !== "number") {
                throw new Error("Price must be a number, not a string");
            }
            if (value < 0) {
                throw new Error("Price must be a positive number");
            }
            return true;
        }),
    body().custom((value, { req }) => {
        const allowedFields = ["destination", "price"];
        const extraFields = Object.keys(req.body).filter(
            (field) => !allowedFields.includes(field)
        );

        // Skip extra field validation for PATCH requests
        if (extraFields.length > 0) {
            throw new Error(`Invalid field(s): ${extraFields.join(", ")}`);
        }
        return true;
    }),
];
// Flight routes
router.get("/", flightsController.getAllFlights);
router.post("/", validateFlightData, flightsController.createFlight);
router.put("/:id", validateFlightData, flightsController.updateFlight);
router.patch("/:id", validateFlightData, flightsController.updateFlight);
router.delete("/:id", flightsController.deleteFlight);

module.exports = router;