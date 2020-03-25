const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-layouts');
const app = express()

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

app.use(express.static(__dirname + '/public'));

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

app.listen(3000, () => console.log('Server running'));