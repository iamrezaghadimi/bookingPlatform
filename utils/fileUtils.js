const fs = require("fs");

async function readData(filePath, callback) {

    try {
        const data = await fs.readFile(filePath, "utf8")
        return JSON.parse(data);
    } catch (error) {
        if(error.code == "ENOENT"){
            return [];
        }
        throw error;
    }
    // fs.readFile(filePath, "utf8", (err, data) => {
    //     if (err) {
    //         if (err.code === "ENOENT") {
    //             return callback([], null);
    //         }
    //         return callback(null, err);
    //     }
    //     try {
    //         const parsedData = JSON.parse(data);
    //         callback(parsedData, null);
    //     } catch (err) {
    //         callback(null, err);
    //     }
    // });
}

async function writeData(filePath, data, callback) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }   

    // fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    //     if (err) {
    //         return callback(err);
    //     }
    //     callback(null);
    // });
}

module.exports = {
    readData,
    writeData,
};