const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const {
    check,
    validationResult
} = require('express-validator');


const client = require('../models/db');

router.use(express.static(path.join(__dirname, '../public')));
//login page
router.get('/login', (req, res) => {
    if (!req.user)
        res.render('login.ejs');
    else
        res.send(`You\'re already logged in as ${req.user.username}!`);
});

//Register page
router.get('/register', (req, res) => {
    if (!req.user)
        res.render('register.ejs')
    else
        res.send(`You're already logged in as ${req.user.username}!`);
});



let validationChecks = [
    check('first_name', 'First name is required').notEmpty(),
    check('last_name', 'Last name is required').notEmpty(),
    check('email', 'Email address is required').notEmpty(),
    check('email', 'Please enter a valid email address').normalizeEmail().isEmail(),
    check('password', 'Please enter a password').notEmpty(),
    check('password', 'Minimum  length of password should be 8 characters').isLength({
        min: 8
    }),
    check('password2', 'Passwords don\'t match').matches('password')
];

//register handle
router.post('/register', validationChecks, (req, res) => {

    let errors = validationResult(req);
    const {
        first_name,
        last_name,
        username,
        dob,
        email,
        password,
        password2
    } = req.body;

    if (!errors.isEmpty()) {
        res.render('register', {
            errors: errors.array(),
            first_name,
            last_name,
            username,
            dob,
            email,
            password,
            password2
        })
    } else {
        errors = []


        var textEmail = "SELECT email from users WHERE email = $1";
        var valuesEmail = [email];
        var textUsername = "SELECT username from users WHERE username = $1";
        var valuesUsername = [username];

        client.query(textEmail, valuesEmail, (err, result1) => {
            if (err) {
                console.log(err.stack)
            } else if (result1.rowCount != 0) {
                errors.push({
                    msg: 'An account with this email address already exists.'
                });
                res.render('register', {
                    errors,
                    first_name,
                    last_name,
                    username,
                    dob,
                    email,
                    password,
                    password2
                });

            } else {
                client.query(textUsername, valuesUsername, (err, result2) => {
                    if (err) {
                        console.log(err.stack)
                    } else if (result2.rowCount != 0) {
                        errors.push({
                            msg: 'Sorry, this username has been taken by someone else!'
                        });
                        res.render('register', {
                            errors,
                            first_name,
                            last_name,
                            username,
                            email,
                            password,
                            password2,
                            dob
                        });
                    } else {

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(password, salt, (err, hash) => {
                                if (err) throw err;
                                //console.log(password);
                                console.log("hash ", hash);
                                console.log(dob);
                                var queryString = "INSERT INTO users ";
                                queryString += "(username, first_name, last_name, email, password, dob) ";
                                queryString += "VALUES( $1, $2, $3, $4, $5, $6);"
                                params = [
                                    username,
                                    first_name,
                                    last_name,
                                    email,
                                    hash,
                                    dob
                                ];
                                client.query(queryString, params, (err) => {
                                    if (err) {
                                        console.log(err.stack)
                                    } else {
                                        console.log("successful");
                                    }
                                });

                                req.flash(
                                    'success_msg',
                                    'You\'re registered! You can log in now.'
                                );
                                res.redirect('/users/login');
                            });
                        });
                    }
                });
            }
        });
    }
});

// Login handle
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true

    })(req, res, next);
    //console.log("req");
    //console.log(res.user);
});

// Logout
router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        req.flash('success_msg', 'You\'ve been logged out');
        res.redirect('/users/login');
    } else {
        res.send('You haven\'t signed in!');
    }
});

module.exports = router;