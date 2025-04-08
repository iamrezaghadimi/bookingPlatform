const deepmerge = require("deepmerge")

const target = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    destination: "Paris",
    price: 500,
    details: {
        airline: "Air France",
        flightNumber: "AF123",
        departureTime: "2023-10-15T14:00:00Z",
    },
};

const newData = {
    price: 600,
    details: {
        airline: "Lufthansa",
        charter: true
    },
};


const updated = deepmerge(target, newData)
console.log(updated);
