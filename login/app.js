const express = require('express');
const { Pool, Client } = require('pg');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Passport Config
require('./config/passport')(passport);


//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser

app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));