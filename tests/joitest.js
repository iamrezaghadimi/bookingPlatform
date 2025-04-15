const Joi = require('joi')

const validateFlight = (data, method) => {
    const optionalSchema = Joi.object({
        dest: Joi.string().max(100),
        price: Joi.number().positive(),
        date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/),
        details: Joi.object({
            airline: Joi.string.max(100),
            flightNumber: Joi.string.max(10),
            tags: Joi.array().max(5).items(Joi.string.max(20)),
        })
    })


    const requiredSchema = Joi.object({
        dest: optionalSchema.dest.required(),
        price: optionalSchema.price.required(),
        date: optionalSchema.date.required(),
        details: Joi.object({
            airline: optionalSchema.details.extract('airline').required(),
            flightNumber: optionalSchema.details.extract('flightNumber').required(),
            tags: optionalSchema.details.extract('tags')
        }).required()
    })

    const querySchema = Joi.object({
        dest: optionalSchema.dest,
        price_min: Joi.number().positive(),
        price_max: Joi.number().positive().when('price_min',{
            is: Joi.exist(),
            then: Joi.number.min(Joi.ref('price_min')),
        }),
        date_min: optionalSchema.date(),
        date_max: optionalSchema.date().when('date_min',{
            is: Joi.exist(),
            then: Joi.string().min(Joi.ref('date_min')),
        }),    
        airline: optionalSchema.details.extract('airline'),
        flightNumber: optionalSchema.details.extract('flightNumber'),
        



    })


    if(method === "PATCH"){
        return optionalSchema.validate(data)
    }
    else if(method === "POST" || method === "PUT"){
        return requiredSchema.validate(data)
    }
    else if(method === "GET"){
        return querySchema.validate(data)
    }

    throw Error("Invalid request method.")
}