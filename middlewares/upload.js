const multer = require("multer")
const path  = require("path")

const destination = path.join(__dirname, "../" , "temp")

const configMul = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: configMul
})

module.exports = upload;