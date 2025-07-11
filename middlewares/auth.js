const jwt = require('jsonwebtoken')
const {getCountryFromIP} = require("../middlewares/session")
const { ForbiddenError, AuthError } = require('../utils/errors')


function auth(roles=[]){
    return async (req, res, next) => {
        if(!req.session || !req.session.userId) 
            throw new AuthError('Access denied. No active session.')

        const userAgent = req.headers["user-agent"]
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const country = await getCountryFromIP(ipAddress)
        console.log(req.session.country);
        console.log(country);
        
        

        if(req.session.country !== country) 
            throw new AuthError('Access denied. Diffrent country detected!')

        if(Date.now() - req.session.lastActive > process.env.SESSION_TIMEOUT_IN_HOURS * 60 * 60 * 1000)
            throw new AuthError('Session expired due to inactivity!')


        if(roles.length > 0 && (!req.session.roles || !roles.some(role=>req.session.roles.includes(role)))){
            throw new ForbiddenError('Access denied! Insufficient priviliges.')
        }

        req.session.lastActive = Date.now()
        next()



        // const token = req.header('x-auth-token')
        // if(!token) return res.status(401).json({error: "Access denied. No token provided."})

        // try{
        //     const authUser = jwt.verify(token, process.env.JWT_SECRET)
        //     req.user = authUser
        //     if(allowedRoles.length > 0 && !allowedRoles.some(allowedRole => authUser.roles.includes(allowedRole))){
        //         return res.status(403).json({error: "Access denied. Insufficeient priviliges."})
        //     }
        //     next()
        // }
        // catch(ex){
        //     return res.status(400).json({error: "Access denied. Invalid token."})
        // }
    }
}


module.exports = auth;


