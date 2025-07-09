const fs = require("fs");
const http = require('http')
const https = require('https')

module.exports = (app) => {
    const port = process.env.PORT || 3000;
    const httpPort = process.env.HTTP_PORT || 80;

    const options = {
        key: fs.readFileSync("./keys/server.key"),
        cert: fs.readFileSync("./keys/server.cert")
    }

    const httpsServer = https.createServer(options, app)

    const httpServer = http.createServer((req, res) => {
        const host = req.headers.host?.replace(`:${httpPort}`, "") || "localhost";
        const statusCode = req.method === "POST" ? 307 : 301;
        res.writeHead(statusCode, {Location: `https://${host}:${port}${req.url}`}).end();
    })

    return {httpsServer, httpServer, port, httpPort}
}
