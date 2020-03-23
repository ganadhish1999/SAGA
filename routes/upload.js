//boiler-plate for file functions


const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const router = express.Router();


// 2 here should be replaced by logged in user's user_id 
// makes each file name unique and can be searched using regex
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({
    storage: storage
}).single("myFile");


router.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(req.file);
            res.send("hello");
        }
    });
});

router.get("/upload", (req, res) => {
    // const readStream = fs.createReadStream('./public/uploads/myFile-1584786868815.png');
    // const writeStream = fs.createWriteStream('./public/uploads/hello4.png');
    // readStream.pipe(writeStream);
    // writeStream.on('finish', () => {
    //     res.sendFile(__dirname + '/public/uploads/hello4.png');
    // });

    // var data = fs.readFileSync(
    //     "C:/Users/SHAHS/Documents/ArnavCode/projects/forum/SAGA/public/uploads/myFile-1584786868815.png"
    // );
    // console.log(data);

    res.send("hello");
});