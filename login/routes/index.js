const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//welcome page
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome');
});

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    //console.log(req.user.username)
    res.render('dashboard', {
        username: req.user.username
    })
);

module.exports = router;