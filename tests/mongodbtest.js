
const mongoose = require('mongoose')

const MONGO_USER="root"
const MONGO_PASSWORD="rezagmail.com"
const MONGO_DATABASE="richard"
const MONGO_HOST="localhost"
const MONGO_PORT=27017

const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`;
// const uri = 'mongodb://localhost:27017/richard'
console.log(uri);

mongoose.connect(uri).then(() => {
    console.log("Connected to mongodb!");
}).catch((err)=>{
    console.log("Error connecting to mongodb:", err);
})


async function insertData(newFlight) {

    const flightSchema = new mongoose.Schema({
        destination: {type: String, required:true},
        price: Number,
        date: Date,
        details:{
            airline: String,
            flightNumber: String
        }
    })
    
    const Flight = mongoose.model("Flight", flightSchema)

    try{
        await Flight.create(newFlight)
        console.log("Successfully inserted!");
    } catch(err){
        console.log("Failed to insert: ", err);
        
    }    
}


const newFlight = {
    extra: "heey!",
    date: new Date("2023-11-20T12:00:00Z"),
    details:{
        airline: "British 2222222222Airways",
        flightNumber: "ACFDD78DD"
    }    
}

insertData(newFlight)

