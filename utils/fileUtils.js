const fs = require("fs");

function readData(filePath, callback) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                return callback([], null);
            }
            return callback(null, err);
        }
        try {
            const parsedData = JSON.parse(data);
            callback(parsedData, null);
        } catch (err) {
            callback(null, err);
        }
    });
}

function writeData(filePath, data, callback) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

module.exports = {
    readData,
    writeData,
};