const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const pool = require('./db');



module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            // Match user
            var textEmail = "SELECT username, email, password from users WHERE email = $1";
            var valuesEmail = [email];
            pool.connect((err, client, release) => {
                if(err) {
                    console.error(err.stack);
                }
                else {
                    client.query(textEmail, valuesEmail, (err, res1) => {
                        release();
                        if (err) {
                            console.log(err.stack)
                        } else if (res1.rowCount == 0) {
                            //console.log("email not register");
                            return done(null, false, {
                                message: 'That email is not registered'
                            });

                        } else {
                            //password match
                            //console.log(res1.rows[0].password);
                            //console.log(password);
                            bcrypt.compare(password, res1.rows[0].password, (err, isMatch) => {
                                if (err) {
                                    console.log(err);
                                }
                                if (isMatch) {
                                    console.log("password match");
                                    return done(null, res1.rows[0]);
                                } else {
                                    return done(null, false, {
                                        message: 'Password incorrect'
                                    });
                                }
                            });
                        }
                    });
                }
        });
    }));


    passport.serializeUser(function(user, done) {
        // console.log(user);
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        var textid = "SELECT user_id, username, email FROM users WHERE username = $1";
        var valuesid = [username];
        pool.connect((err, client, release) => {
            client.query(textid, valuesid, (err, res1) => {
                release();
                done(err, res1.rows[0]);
            });
        });
    });
}