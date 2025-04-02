const { validationResult } = require("express-validator"); 
const { readData, writeData } = require("../utils/fileUtils");
const { v4: uuidv4 } = require("uuid");

const flightsFilePath = "./data/flights.json";

const getAllFlights = (req, res) => {
    const { dest, price_gte, price_lte } = req.query;

    readData(flightsFilePath, (data, err) => {
        if(err) return res.status(500).json({error: "Failed to read flight data."})
            if(dest)       data = data.filter((flight) => flight.dest.toLowerCase().include(dest.toLowerCase()))
            if(price_lte)  data = data.filter((flight) => parseFloat(flight.price) <= parseFloat(price_lte))   
            if(price_gte)  data = data.filter((flight) => parseFloat(flight.price) >= parseFloat(price_lte))        
            return res.status(200).json(data)  
    });
};

const createFlight = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const newFlight = {
        id: uuidv4(), // Generate a UUID for the new flight
        destination: req.body.destination,
        price: req.body.price,
    };

    readData(flightsFilePath, (data, err) => {
        if (err) return res.status(500).json({ error: "Failed to read flights data" });
        data.push(newFlight);
        writeData(flightsFilePath, data, (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to save flight data" });
            }
            res.status(201).json({ message: "Flight created successfully" });
        });
    });
};

const updateFlight = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const flightId = req.params.id;
    const updatedFlight = req.body;

    readData(flightsFilePath, (data, err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read flights data" });
        }

        const index = data.findIndex((flight) => flight.id === flightId);
        if (index === -1) {
            return res.status(404).json({ error: "Flight not found" });
        }

        data[index] = { ...data[index], ...updatedFlight };
        writeData(flightsFilePath, data, (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update flight data" });
            }
            res.status(200).json({ message: "Flight updated successfully" });
        });
    });
};

const deleteFlight = (req, res) => {
    const flightId = req.params.id;

    readData(flightsFilePath, (data, err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read flights data" });
        }

        const index = data.findIndex((flight) => flight.id === flightId);
        if (index === -1) {
            return res.status(404).json({ error: "Flight not found" });
        }

        data.splice(index, 1);
        writeData(flightsFilePath, data, (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to delete flight data" });
            }
            res.status(200).json({ message: "Flight deleted successfully" });
        });
    });
};

module.exports = {
    getAllFlights,
    createFlight,
    updateFlight,
    deleteFlight,
};