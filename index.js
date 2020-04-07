const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-layouts');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: "./public/uploads/postFiles/",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //5mb
});


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.end('Index');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

app.get('/subforum', (req, res) => {
    res.render('subforum');
});


app.get('/create-post', (req, res) => {
    res.render('create-post');
})

app.post('/create-post', (req, res) => {
    console.log('POST: /create-post');
    postTitle = req.body.title;
    postContent = req.body['post-content'];
    categories = req.body.tags.split(',');

    console.log(`Title: ${postTitle}`);
    console.log(`postContent: ${postContent}`);
    console.log(`categories / tags: ${categories}`);

    res.send(postTitle + postContent + categories);

    // Images / other docs through editor
    // @user functionality
    // Exit from blockquote XD
    // SQL injection
    // XSS attacks

});

app.post('/upload', upload.array('file', 1), (req, res) => {
    console.log('/uploads/postFiles/' + req.files[0].filename);
    res.json({location: '/uploads/postFiles/' + req.files[0].filename});
});




/* app.get('/user-data', (req, res) => {
    console.log('user-data req');
    // Return usern data for current user
    res.send({currentUser:{username: '@CurrentUser'}});
}) */

server.listen(3000, () => console.log('Server running'));

module.exports = io;
require('./socketio');