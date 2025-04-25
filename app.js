require("dotenv").config();
const express = require("express");
const debug = require("debug")("app:normal");
const morgan = require("morgan");

const flightsRouter = require("./routes/flights");
const hotelsRouter = require("./routes/hotels");

const uri = 'mongodb://localhost:27017/richard'
mongoose.connect(uri).then(() => {
    console.log("Connected to mongodb!");
}).catch((err)=>{
    console.log("Error connecting to mongodb:", err);
})


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

if(app.get('env')==="development"){
    app.use(morgan('dev'))
}

app.use("/flights", flightsRouter);
app.use("/hotels", hotelsRouter);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: "Invalid JSON syntax" });
    }
    next();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});