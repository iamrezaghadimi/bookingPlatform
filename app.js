require("dotenv").config();
const express = require("express");
const debug = require("debug")("app:normal");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rateLimit = require('rate-limiter-flexible');
const flightsRouter = require("./routes/flights");
const hotelsRouter = require("./routes/hotels");

const app = express();
const port = process.env.PORT || 3000;


if(app.get('env')==="production"){
    // Rate limiter middleware (to prevent abuse) - Always active
    const limiter = new rateLimit.RateLimiterMemory({
        points: 5, // 5 requests
        duration: 1, // per second
    });
    app.use((req, res, next) => {
        limiter.consume(req.ip)
            .then(() => next())
            .catch(() => res.status(429).send('Too many requests'));
    });    

    app.use(helmet());        // Set security-related HTTP headers
    app.use(cors());          // Enable Cross-Origin Resource Sharing
}

// app.use("/stripe", stripeRouter);


app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

if(app.get('env')==="production"){
    app.use(compression());  // Compress responses for better performance
}

if(app.get('env')==="development"){
    app.use(morgan('dev'))
}

// app.use(express.static(path.join(__dirname, 'public')));  // Serve files in the 'public' directory



app.use("/flights", flightsRouter);
app.use("/hotels", hotelsRouter);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: "Invalid JSON syntax" });
    }
    next();
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});