const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const {
    check,
    validationResult
} = require('express-validator');


/*const { Pool } = require('pg');
const {
    connectionString
} = require('../config/keys')*/

const pool = require('../config/db');

router.use(express.static(path.join(__dirname, '../public')));
//login page
router.get('/login', (req, res) => {
    if (!req.user)
        res.render('login.ejs' , { title: "Login" });
    else
        res.render('error-page', {title: `You\'re already logged in as ${req.user.username}!`});
});

//Register page
router.get('/register', (req, res) => {
    if (!req.user)
        res.render('register.ejs', {title: "Register"});
    else
        res.render('error-page', { error:`You're already logged in as ${req.user.username}!`, user:req.user});
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
    // check('password2', 'Passwords don\'t match').matches('password'),
    check('password2').custom((value, { req, loc, path }) => {
        if (value !== req.body.password)
            throw new Error('Passwords don\'t match');
        else
            return value;

    }),
    check('qualifications', 'What are your qualifications?').notEmpty(),
    check('interests', 'You must be interested in something, right? Please enter at least one interest!').notEmpty(),
    check('about', 'Tell us something about yourself.').notEmpty()
];

//register handle
router.post('/register', validationChecks, async (req, res) => {

    let errors = validationResult(req);
    console.log(req.body);
    const {
        first_name,
        last_name,
        username,
        dob,
        email,
        password,
        password2,
        interests,
        qualifications,
        about
    } = req.body;
    if(typeof interests == 'string')
        var interestsList = interests.split(',');
    else
        var interestsList = interests;
    if(typeof qualifications == 'string')
        var qualificationsList = qualifications.split(',');
    else
        var qualificationsList = qualifications;    
    

    if (!errors.isEmpty()) {
        res.render('register', {
            errors: errors.array(),
            first_name,
            last_name,
            username,
            dob,
            email,
            interests,
            qualifications,
            about
        })
    } else {
        errors = [];

        var textEmail = "SELECT email from users WHERE email = $1";
        var valuesEmail = [email]; // $1 above
        var textUsername = "SELECT username from users WHERE username = $1";
        var valuesUsername = [username]; // $1 above
        
        try {
            const client = await pool.connect();
            var result1 = await client.query(textEmail, valuesEmail);
            if(result1.rowCount != 0) {
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
                    interests,
                    qualifications,
                    about
                });
                client.release();
            }
            else {
                var result2 = await client.query(textUsername, valuesUsername);
                if(result2.rowCount != 0) {
                    errors.push({
                        msg: 'Sorry, this username has been taken by someone else!'
                    });
                    res.render('register', {
                        errors,
                        first_name,
                        last_name,
                        username,
                        email,
                        dob,
                        interests,
                        qualifications,
                        about
                    });
                    client.release();
                }
                else {
                    bcrypt.genSalt(10, async (err, salt) => {
                        bcrypt.hash(password, salt, async (err, hash) => {
                            if (err) throw err;
                            //console.log(password);
                            console.log("hash ", hash);
                            console.log(dob);
                            var queryString = "INSERT INTO users ";
                            queryString += "(username, first_name, last_name, email, password, dob) ";
                            queryString += "VALUES( $1, $2, $3, $4, $5, $6) RETURNING user_id;"
                            params = [
                                username,
                                first_name,
                                last_name,
                                email,
                                hash,
                                dob
                            ];
                            var result =  await client.query(queryString, params);
                            console.log("Inserted into user table successfully");
                            console.log(result.rows[0].user_id);
                            var user_id = result.rows[0].user_id;

                            console.log('Qualifications:');
                            console.log(qualificationsList);
                            console.log('Interests:');
                            console.log(interestsList);

                            if (typeof interestsList != 'undefined' && interestsList.length != 0) {
                                interestsList.forEach(async interest => {
                                    var sql = 'INSERT INTO user_interest';
                                    sql += '(user_id, interest)';
                                    sql += 'VALUES($1, $2);';
                                    params = [user_id, interest.trim()];
                                    var interestResult = await client.query(sql, params);
                                    console.log('Interest added successfully');
                                
                                })
                            }

                            if (typeof qualificationsList != 'undefined' && qualificationsList.length != 0) {   
                                qualificationsList.forEach(async qualification => {
                                    var sql = 'INSERT INTO user_qualification';
                                    sql += '(user_id, qualification)';
                                    sql += 'VALUES($1, $2);';
                                    params = [user_id, qualification.trim()];
                                    var qualificationsResult = await client.query(sql, params)
                                    console.log("Qualification added successfully");
                                });
                            }

                            if (typeof about != 'undefined') {
                                
                                var sql = 'INSERT INTO user_about';
                                sql += '(user_id, about)';
                                sql += 'VALUES($1, $2);';
                                params = [user_id, about];
                                var aboutResult = client.query(sql, params);
                                console.log("About added successfully");
                                
                            }
                            client.release();
                            req.flash(
                                'success_msg',
                                'You\'re registered! You can log in now.'
                            );
                            res.redirect('/users/login');
                        }
                    )});
                }
            }

        }
        catch(err) {
            console.error('[ERR] /users/register', err);
        }        
    }
});


// Login handle
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/home',
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