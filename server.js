/*
    sql injection
    make user card in front end
    lazy load all get routes
    tie the logged in user
*/

/*
    for file upload -- in form tag -- enctype = 'multipart/form-data
*/

/*
    start server command - npm start

    to installl - npm install package_name
        express
        bodyparser
        pg
        dotenv
        multer
        Router
        bcryptjs
        connect-flash
        ejs
        express
        express-ejs-layouts
        express-session
        express-validator
        passport
        passport-local
        validator
        lodash
        nodemon
*/

const express = require('express');
const bodyParser = require('body-parser');
const {
    Client
} = require('pg');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');


//for port to be set as env var(other env vars can also be created but did not make database
//properties as env var due to issues)--use connection string instead
require('dotenv').config();


const app = express();
const server = require('http').createServer(app);

// Passport Config
require('./config/passport')(passport);

// Public directory
app.use(express.static(path.join(__dirname, '/public')));

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

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
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use(require('./routes')); //routes
// const usersHandler = require('./routes/users');
// app.use('/users', usersHandler);


app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running... on port ${process.env.PORT}.`);
});



const io = require('socket.io')(server);
module.exports = io;
require('./socketio');