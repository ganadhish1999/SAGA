/*
    profile/
           /about
           /image
           /qualifications
           /interests
           /upload
*/
const express = require('express');
const fs = require('fs');
const path = require("path");
const multer = require("multer");
const { Client } = require('pg');
const router = express.Router();


const { connectionString } = require("../config/keys");

const storage = multer.diskStorage({
    destination: "./public/uploads/profileImages/",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 }, //2mb
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
})


function checkFileType(file, cb) {
    const file_types = /jpeg|jpg|png/;
    const ext_name = file_types.test(path.extname(file.originalname).toLowerCase());
    const mime_type = file_type.test(file.mimetype);

    if (ext_name && mime_type) {
        return cb(null, true);
    } else {
        cb('Error! Images only.');
    }
}


router.get('/', (req, res) => {
    //display qualifications, interests, about, photo
    //list of posts,, subforums, communities, chats
});

router.post('/about', (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO about";
            sql += "(about,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.about,
                req.body.user_id
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});

router.post('/image', upload.single("myFile"), (req, res) => {
    res.send("hello");
    // console.log("post body ", req.body);

    var data = fs.readFileSync(
        "C:/Users/SHAHS/Documents/ArnavCode/projects/forum/SAGA/public/uploads/profileImages/" +
        req.file.filename
    );

    ext = path.extname(req.file.originalname);
    const client = new Client({ connectionString: connectionString });

    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "IF EXISTS(SELECT * FROM image WHERE user_id = $1) ";
            sql += "UPDATE image SET image_data = $2, file_ext = $3 WHERE user_id = $1 ";
            sql += "ELSE ";
            sql = "INSERT INTO image";
            sql += "(user_id, image_data, file_ext)";
            sql += "VALUES ($1, $2, $3) RETURNING *";
            var params = [
                req.body.user_id, //current user_id
                data,
                ext
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});

router.post('/qualifications', (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO qualifications";
            sql += "(qualifications,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.qualifications,
                req.body.user_id
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});

router.post('/interests', (req, res) => {
    res.send("hello");
    console.log("post body ", req.body);
    const client = new Client({ connectionString: connectionString });
    client
        .connect()
        .then(() => {
            console.log("connection successful!");
            var sql = "INSERT INTO interests";
            sql += "(interests,user_id)";
            sql += "VALUES ($1, $2)";
            var params = [
                req.body.interests,
                req.body.user_id
            ];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log("done");
        })
        .catch((err) => {
            console.log("error is: ", err);
        });
});


module.exports = router;