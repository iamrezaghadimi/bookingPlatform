const {Flight, validateFlight} = require('../models/Flight')
const { v4: uuidv4 } = require("uuid");


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
};

const createFlight = async (req, res) => {
    const {error} = validateFlight(req.body, req.method)
    if(error) return res.status(400).json({error: error.details})

    try {
        const flight = new Flight(req.body)
        await flight.save()
        res.status(201).json(flight);
    } catch (error) {
        return res.status(500).json({error: "Failed to create flight."})
    }
};

const updateFlight = async (req, res) => {
    const {error} = validateFlight(req.body, req.method)
    if(error) return res.status(400).json({error: error.details})

    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {new: True})
        if(!flight) return res.status(404).json({error: "Flight not found"})
        res.status(200).json(flight);
    } catch (error) {
        return res.status(500).json({error: "Failed to update flight data."})
    }   
};

const deleteFlight = async (req, res) => {

    try {
        if(req.path.endsWith("/")){
            const results = await Flight.deleteMany({})
            if(results.deletedCount === 0){
                return res.status(404).json({error: "No flights found to delete."})
            }
            res.status(200).json({ message: "All flights deleted successfully." });
        } 
        else{
            const flight = await Flight.findByIdAndDelete(req.params.id)
            if(!flight) return res.status(404).json({error: "Flight not found."})
            res.status(200).json({ message: "Flight deleted successfully." });
        }
    } catch (error) {
        return res.status(500).json({error: "Failed to delete flight data."})
    }   
};

module.exports = {
    getAllFlights,
    createFlight,
    updateFlight,
    deleteFlight,
};