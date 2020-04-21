const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();



const storage = multer.diskStorage({
    destination: "./public/uploads/postFiles/",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }, //5mb
});


router.post("/", upload.single("file"), (req, res) => {
    console.log("/uploads/postFiles/" + req.file.filename);
    res.json({
        location: "/uploads/postFiles/" + req.file.filename
    });
});

module.exports = router;