const jwt = require('jsonwebtoken')


function auth(allowedRoles=[]){
    return (req, res, next) => {
        const token = req.header('x-auth-token')
        if(!token) return res.status(401).json({error: "Access denied. No token provided."})

        try{
            const authUser = jwt.verify(token, process.env.JWT_SECRET)
            req.user = authUser
            if(allowedRoles.length > 0 && !allowedRoles.some(allowedRole => authUser.roles.includes(allowedRole))){
                return res.status(403).json({error: "Access denied. Insufficeient priviliges."})
            }
            next()
        }
        catch(ex){
            return res.status(400).json({error: "Access denied. Invalid token."})
        }
    }
}


module.exports = auth;


