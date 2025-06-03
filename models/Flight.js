const Joi = require('joi')
const mongoose = require('mongoose')

const flightSchema = new mongoose.Schema({
    destination: String,
    price: Number,
    date: Date,
    details:{
        airline: String,
        flightNumber: String,
        tags: [{type :String}]
    }
})

const Flight = mongoose.model("Flight", flightSchema)


const validateFlight = (data, method) => {
    const optionalSchema = {
        destination: Joi.string().max(100),
        price: Joi.number().positive(),
        date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/),
        details: Joi.object({
            airline: Joi.string().max(100),
            flightNumber: Joi.string().max(10),
            tags: Joi.array().max(5).items(Joi.string().max(20)),
        })
    }


    const requiredSchema = {
        destination: optionalSchema.destination.required(),
        price: optionalSchema.price.required(),
        date: optionalSchema.date.required(),
        details: Joi.object({
            airline: optionalSchema.details.extract('airline').required(),
            flightNumber: optionalSchema.details.extract('flightNumber').required(),
            tags: optionalSchema.details.extract('tags')
        }).required()
    }

    const querySchema = {
        destination: optionalSchema.destination,
        price_min: Joi.number().positive(),
        price_max: Joi.number().positive().when('price_min',{
            is: Joi.exist(),
            then: Joi.number().min(Joi.ref('price_min')),
        }),
        date_start: optionalSchema.date,
        date_end: optionalSchema.date.when('date_min',{
            is: Joi.exist(),
            then: Joi.string().min(Joi.ref('date_min')),
        }),    
        airline: optionalSchema.details.extract('airline'),
        flightNumber: optionalSchema.details.extract('flightNumber'),
        tags: Joi.string().custom((value, helpers) => {
            const tags = value.split(',').map(tag => tag.trim())
            if(tags.length > 3){
                return helpers.error('any.invalid', {message: "Max of 3 tags allowed."})
            }
            return tags
        }, "Split tags by comma and validate max 3 tags"),
        sortBy: Joi.string().valid(
            'destination', 'price', 'date', 'details.airline', 'details.flightNumber',
            '-destination', '-price', '-date', '-details.airline', '-details.flightNumber',
        ),
        limit: Joi.number().integer().positive(),
        page: Joi.number().integer().positive(),

    }


    if(method === "PATCH"){
        return Joi.object(optionalSchema).validate(data)
    }
    else if(method === "POST" || method === "PUT"){
        return Joi.object(requiredSchema).validate(data)
    }
    else if(method === "GET"){
        return Joi.object(querySchema).validate(data)
    }

    throw Error("Invalid request method.")
}



module.exports = {Flight, validateFlight}