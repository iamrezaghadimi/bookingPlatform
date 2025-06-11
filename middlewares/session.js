async function getCountryFromIP(ip){
    return "unknown"
}

async function createSession(req, user){
    return new Promise(async(resolve, reject) => {
        const userAgent = req.headers["user-agent"]
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const timezone = req.headers['timezone'] || "Unknown"
        const country = await getCountryFromIP(ipAddress)


        req.session.regenerate((err) => {
            if(err) return reject({error: "Session generation failed"})

            req.session.userId = user._id
            req.session.roles = user.roles
            req.session.userAgent = userAgent
            req.session.ipAddress = ipAddress
            req.session.timezone = timezone
            req.session.country = country
            req.session.lastActive = Date.now()

            return resolve({message: "Session created successfully", user})

        })
    })
}

module.exports = {createSession}