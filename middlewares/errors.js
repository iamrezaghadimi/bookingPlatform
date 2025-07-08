const  {AppError, ValidationError} = require('../utils/errors')

module.exports =  (err, req, res, next) => {

    if(err instanceof ValidationError){
        return res.status(err.statusCode).json({
            error: {
                type: err.name,
                message: err.message,
                details: err.details.map(detail => ({
                    message: detail.message,
                    path: detail.path,
                    type: detail.type
                }))
            }
        })
    }

    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            error: {
                type: err.name,
                message: err.message,
            }
        })
    }
    

    return res.status(500).json({
        error: {
            type: "InternalServerError",
            message: "Something has went wrong! That's all we know!",
            ...(process.env.NODE_ENV === "development" && {
                message: err.message,
                stack: err.stack
            })
        }
    })

}