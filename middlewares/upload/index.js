const {multerConfig} = require("./config")
const {handleUpload} = require("./uploadHandler")
const {cleanupUserUploads} = require("./fileCleaner")


module.exports({
    upload: multerConfig.fields([
        {name: 'avatar', maxCount:1},
        {name: 'document', maxCount:1},
    ]),
    handleUpload,
    cleanupUserUploads
})