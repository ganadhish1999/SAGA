const express = require('express');
const expressLayouts = require('express-layouts');
const app = express()

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.end('Index');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

app.get('/subforum', (req, res) => {
    res.render('subforum');
});

app.listen(5000, () => console.log('Server running'));