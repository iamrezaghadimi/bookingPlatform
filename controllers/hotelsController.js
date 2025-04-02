const { validationResult } = require("express-validator"); 
const { readData, writeData } = require("../utils/fileUtils");

const hotelsFilePath = "./data/hotels.json";

const getAllHotels = (req, res) => {
    const { name, location, price_gte, price_lte } = req.query;


};

const createHotel = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newHotel = {
        id: uuidv4(), // Generate a UUID for the new hotel
        name: req.body.name,
        location: req.body.location,
        price: req.body.price,
    };

};

const updateHotel = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const hotelId = parseInt(req.params.id);
    const updatedHotel = req.body;


};

const deleteHotel = (req, res) => {
    const hotelId = parseInt(req.params.id);


};

module.exports = {
    getAllHotels,
    createHotel,
    updateHotel,
    deleteHotel,
};