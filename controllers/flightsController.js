const {Flight, validateFlight} = require('../models/Flight');
const { ValidationError, NotFoundError } = require('../utils/errors');

const getAllFlights = async (req, res) => {
    const {error} = validateFlight(req.query, req.method)
    if(error) throw new ValidationError(error.details)

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


};

const createFlight = async (req, res) => {
    const {error} = validateFlight(req.body, req.method)
    if(error) throw new ValidationError(error.details)

    const flight = new Flight(req.body)
    await flight.save()
    res.status(201).json(flight);
};

const updateFlight = async (req, res) => {
    const {error} = validateFlight(req.body, req.method)
    if(error) throw new ValidationError(error.details)

    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {new: True})
    if(!flight) throw new NotFoundError("Flight record not found.")
    res.status(200).json(flight);

};

const deleteFlight = async (req, res) => {

    if(req.path.endsWith("/")){
        const results = await Flight.deleteMany({})
        if(results.deletedCount === 0){
            if(!flight) throw new NotFoundError("No flights found to delete.")
        }
        res.status(200).json({ message: "All flights deleted successfully." });
    } 
    
    const flight = await Flight.findByIdAndDelete(req.params.id)
    if(!flight) throw new NotFoundError("Flight record not found.")
    res.status(200).json({ message: "Flight deleted successfully." });
};

module.exports = {
    getAllFlights,
    createFlight,
    updateFlight,
    deleteFlight,
};