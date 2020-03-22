const  express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {check, validationResult } = require('express-validator');


const client = require('../models/db');


//login page
router.get('/login', (req, res) => res.render('login.ejs'));

//Register page
router.get('/register', (req, res) => res.render('register.ejs'));

//register handle
router.post('/register', (req, res) =>{
        const { first_name, last_name, username, dob, email, password, password2 } = req.body;
        let errors = [];

        //check required fields
        if(!first_name || !last_name || !username || !dob || !email || !password || !password2)
        {
            errors.push({ msg : 'Please fill in all fields'});
        }
        //
        if(password.length<6)
        {
            errors.push({msg: 'Password should contain atleast 6 characters'});
        }
        if(password!=password2)
        {
            errors.push({msg: 'Passwords do not match'});
        }


        if(errors.length > 0)
        {
            res.render('register',{
                errors, first_name, last_name, username, dob, email, password, password2
            } );
        }
        else
        {
            var textEmail = "SELECT email from users WHERE email = $1" ;
            var valuesEmail = [email];
            var textUsername =  "SELECT username from users WHERE username = $1" ;
            var valuesUsername = [username];
            
            client.query(textEmail, valuesEmail, (err, res1) => {
                if (err) {
                    console.log(err.stack)
                } 
                else if(res1.rowCount!=0)
                {
                    errors.push({ msg: 'Email already exists' });
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
                
                }
                else
                {

                    client.query(textUsername, valuesUsername, (err, res2) => {
                    if (err) {
                        console.log(err.stack)
                    } 
                    else if(res2.rowCount!=0)
                    {   
                        errors.push({ msg: 'Username already in use try some different username' });
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
                    }
                    else
                    {
                        const { first_name, last_name, username, dob, email, password, password2 } = req.body;
                        bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        //console.log(password);
                        console.log("hash");
                        console.log(hash);
                        var queryString = "INSERT INTO users(username, first_name, last_name, email, password, dob) VALUES( $1, $2, $3, $4, $5, $6)";
                        
                        client.query(queryString,[username, first_name, last_name, email, hash, dob],  (err) => {
                            if (err) {
                                console.log(err.stack)
                            }
                            else{
                                console.log("successful");
                            }
                            });
                        
                        req.flash(
                            'success_msg',
                            'You are now registered and can log in'
                          );
                        
                        res.redirect('/users/login');
            
                        });
                        });
                    }
                    });
                }

              
            });    
        }
    }
    
 
);

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
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;