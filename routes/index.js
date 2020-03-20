/*
    this file combines all other routes and is required by server.js
*/

const express = require("express");
const router = express.Router();

router.use("/home", require("./home"));
router.use("/profile", require("./profile"));
router.use("/post", require("./post"));
router.use("/subforum", require("./subforum"));
router.use("/community", require("./community"));
router.use("/comment", require("./comment"));
router.use("/chat", require("./chat"));


module.exports = router