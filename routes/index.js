/*
    this file combines all other routes and is required by server.js
*/

const express = require("express");
const router = express.Router();
const {
    ensureAuthenticated,
    forwardAuthenticated
} = require("../config/auth");

//welcome page
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome');
});

//Dashboard         --will be replaced by home
// router.get('/home', ensureAuthenticated, (req, res) => res.send('Logged in!'));


router.use("/users", require("./users"));
router.use("/home", require("./home"));
router.use("/search", require("./search"));
router.use("/profile", require("./profile"));
router.use("/post", require("./post"));
router.use("/upload", require("./upload"));
router.use("/subforum", require("./subforum"));
router.use("/community", require("./community"));
router.use("/comment", require("./comment"));
router.use("/feedback", require("./feedback"));
router.use("/chat", require("./chat"));

router.get('/chat', (req, res) => res.render('chat'));


module.exports = router