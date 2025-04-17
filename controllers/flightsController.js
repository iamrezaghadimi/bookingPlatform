// const deepmerge = require("deepmerge")
// const { validationResult } = require("express-validator"); 
// const { readData, writeData } = require("../utils/fileUtils");
const {Flight, validateFlight} = require('../models/Flight')
const { v4: uuidv4 } = require("uuid");

// const flightsFilePath = "./data/flights.json";


const getAllFlights = async (req, res) => {
    const {error} = validateFlight(req.query, req.method)
    if(error) return res.status(400).json({error: error.details})

    const { 
        destination, 
        price_min, 
        price_max, 
        date_start,
        date_end,
        airline,
        flightNumber,
        tags,
        sortBy,
        limit=10,
        page=1
    } = req.query;    

    const query = {};
    if(destination) query.destination = new RegExp(destination, 'i')
    if(price_min || price_max){
        query.price = {}
        if(price_min) query.price.$gte = parseFloat(price_min)
        if(price_max) query.price.$lte = parseFloat(price_max)    
    }
    if(date_start || date_end){
        query.date = {}
        if(date_start) query.date.$gte = new Date(date_start)
        if(date_end) query.date.$lte = new Date(date_end)    
    }
    
    if(airline) query['details.airline'] = new RegExp(airline, 'i')
    if(flightNumber) query['details.flightNumber'] = new RegExp(flightNumber, 'i')
    if(tags) query['details.tags']  = {$in: tags.split(",").map(tag => new RegExp(tag, 'i'))}

    try{
        const flights = await Flight.find(query)
                                    .sort(sortBy)
                                    .skip((page - 1)*limit)
                                    .limit(limit)
                                    .exec();

        const count = await Flight.countDocuments(query)
        return res.status(200).json({
            flights,
            totalPage: Math.ceil(count/limit),
            currentPage: page
        })

    } catch (error) {
        return res.status(500).json({error: "Failed to tetch flight data."})
    }

    // const { dest, price_gte, price_lte } = req.query;
    // try {
    //     let data = await readData(flightsFilePath)
    //     if(dest)       data = data.filter((flight) => flight.dest.toLowerCase().include(dest.toLowerCase()))
    //     if(price_lte)  data = data.filter((flight) => parseFloat(flight.price) <= parseFloat(price_lte))   
    //     if(price_gte)  data = data.filter((flight) => parseFloat(flight.price) >= parseFloat(price_lte))        
    //     return res.status(200).json(data)  
    // } catch (error) {
    //     return res.status(500).json({error: "Failed to read flight data."})
    // }

    // readData(flightsFilePath, (data, err) => {
    //     if(err) return res.status(500).json({error: "Failed to read flight data."})
    //         if(dest)       data = data.filter((flight) => flight.dest.toLowerCase().include(dest.toLowerCase()))
    //         if(price_lte)  data = data.filter((flight) => parseFloat(flight.price) <= parseFloat(price_lte))   
    //         if(price_gte)  data = data.filter((flight) => parseFloat(flight.price) >= parseFloat(price_lte))        
    //         return res.status(200).json(data)  
    // });
};

const createFlight = async (req, res) => {
    const {error} = validateFlight(req.body, req.method)
    if(error) return res.status(400).json({error: error.details})
    // const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const newFlight = {
        id: uuidv4(), // Generate a UUID for the new flight
        destination: req.body.destination,
        price: req.body.price,
    };


    try {
        let data = await readData(flightsFilePath)
        data.push(newFlight);
        await writeData(flightsFilePath, data)
        res.status(201).json({ message: "Flight created successfully" });
    } catch (error) {
        return res.status(500).json({error: "Failed to add flight data."})
    }

    // readData(flightsFilePath, (data, err) => {
    //     if (err) return res.status(500).json({ error: "Failed to read flights data" });
    //     data.push(newFlight);
    //     writeData(flightsFilePath, data, (err) => {
    //         if (err) {
    //             return res.status(500).json({ error: "Failed to save flight data" });
    //         }
    //         res.status(201).json({ message: "Flight created successfully" });
    //     });
    // });
};

const updateFlight = async (req, res) => {
    const {error} = validateFlight(req.body, req.method)
    if(error) return res.status(400).json({error: error.details})

    // const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const flightId = req.params.id;
    const updatedFlight = req.body;


    try {
        let data = await readData(flightsFilePath)
        const index = data.findIndex((flight) => flight.id === flightId);
        if (index === -1) {
            return res.status(404).json({ error: "Flight not found" });
        }
        // data[index] = { ...data[index], ...updatedFlight };
        data[index] = deepmerge(data[index], updatedFlight)
        await writeData(flightsFilePath, data)
        res.status(200).json({ message: "Flight updated successfully" });
    } catch (error) {
        return res.status(500).json({error: "Failed to update flight data."})
    }   

    // readData(flightsFilePath, (data, err) => {
    //     if (err) {
    //         return res.status(500).json({ error: "Failed to read flights data" });
    //     }

    //     const index = data.findIndex((flight) => flight.id === flightId);
    //     if (index === -1) {
    //         return res.status(404).json({ error: "Flight not found" });
    //     }

    //     data[index] = { ...data[index], ...updatedFlight };
    //     writeData(flightsFilePath, data, (err) => {
    //         if (err) {
    //             return res.status(500).json({ error: "Failed to update flight data" });
    //         }
    //         res.status(200).json({ message: "Flight updated successfully" });
    //     });
    // });
};

const deleteFlight = async (req, res) => {
    const flightId = req.params.id;

    try {
        let data = await readData(flightsFilePath)
        const index = data.findIndex((flight) => flight.id === flightId);
        if (index === -1) {
            return res.status(404).json({ error: "Flight not found" });
        }
        data.splice(index, 1);
        await writeData(flightsFilePath, data)
        res.status(200).json({ message: "Flight deleted successfully" });
    } catch (error) {
        return res.status(500).json({error: "Failed to delete flight data."})
    }   


    // readData(flightsFilePath, (data, err) => {
    //     if (err) {
    //         return res.status(500).json({ error: "Failed to read flights data" });
    //     }

    //     const index = data.findIndex((flight) => flight.id === flightId);
    //     if (index === -1) {
    //         return res.status(404).json({ error: "Flight not found" });
    //     }

    //     data.splice(index, 1);
    //     writeData(flightsFilePath, data, (err) => {
    //         if (err) {
    //             return res.status(500).json({ error: "Failed to delete flight data" });
    //         }
    //         res.status(200).json({ message: "Flight deleted successfully" });
    //     });
    // });
};

module.exports = {
    getAllFlights,
    createFlight,
    updateFlight,
    deleteFlight,
};