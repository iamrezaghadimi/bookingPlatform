const mongoose = require('mongoose')
const {Flight} = require('../models/Flight');

const dbURI = `mongodb://root:rezagmail.com@localhost:27017/expediaDB?authSource=admin`;
// const dbURI = `mongodb://localhost:27017/expediaDB`;

mongoose.connect(dbURI)
.then(console.log("Connected to MongoDB!"))
.catch(err => console.log("Connection failed: ", err))


const getRandomDest = () => {
    const destinations = ['JFK', 'LAX', 'ORD', 'ATL', 'MIA', 'SFO', 'LHR', 'CDG', 'FRA', 'DXB', 'HND'];
    return destinations[Math.floor(Math.random() * destinations.length)]
}

const getRandomDate = () => {
    const now = new Date()
    const randomDays = Math.floor(Math.random() * 30)
    const randomDate = new Date(now.setDate(now.getDate() + randomDays))
    randomDate.setHours(Math.floor(Math.random() * 24))
    randomDate.setMinutes(Math.floor(Math.random() * 60))
    return randomDate
}

const getRandomPrice = () => {
    return Math.floor(Math.random() * 500)
}


const getRandomAirline = () => {
    const airlines = ['American Airlines', 'Delta', 'United Airlines', 'Southwest', 'Lufthansa', 'British Airways', 'Air France', 'Emirates', 'Qatar Airways'];
    return airlines[Math.floor(Math.random() * airlines.length)]
}


const getRandomFlightNumber = () => {
    const prefixes = ['AA', 'DL', 'UA', 'BA', 'LH', 'EK']
    const prefix =  prefixes[Math.floor(Math.random() * prefixes.length)]
    const num = Math.floor(Math.random() * 9000) + 1000
    return `${prefix}${num}`
}

const getRandomTags = () => {
    const tags = ['On Time', 'Delayed', 'Cancelled', 'Departed', 'Landed']
    return [tags[Math.floor(Math.random() * tags.length)], "Paid"]
}


const populate = async () => {
    try{
        let flightsToInsert = [];
        const flightCount = 100
        for (let i = 0; i < flightCount; i++) {
            let flight = {
                destination: getRandomDest(),
                price: getRandomPrice(),
                flightDate: getRandomDate(),
                details:{
                    airline: getRandomAirline(),
                    flightNumber: getRandomFlightNumber(),
                    tags: getRandomTags()
                }                
            }
            flightsToInsert.push(flight)
        }
        await Flight.insertMany(flightsToInsert)
    }
    catch(error){
        console.log('Error populating: ', error);     
    }
    finally{
        console.log('Closing connection...');
        mongoose.connection.close()
    }
}

mongoose.connection.once('open', () => {
    populate();
})


