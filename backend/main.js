// require packages
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const documents = require('./schemas/documents.js');

// get port
const port = process.env.PORT || 3000;

// create mongoose connection
mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_ADDRESS);

// provide frontend files
app.use(express.static("frontend"));

// Routes
// handle link access
app.get('/', (req, res) => res.redirect("/newLink.html"));
app.get('/:linkName', (req, res) => {
    let url = req.params.linkName;
    documents.findOne({
        name: url
    }, function (err, doc) {
        if (err || !doc || !doc.urls) res.status(404).json({
            'error': 'Invalid linking name'
        });
        else {
            res.status(301).redirect(doc.urls[Math.floor(Math.random() * (doc.urls.length + 1))]);
        }
    });
});

// handle link creation
app.post('/new', (req, res) => {
    let url = req.params.name;
    let links = req.params.urls;
    let newUrl = documents({
        name: url,
        urls: links
    });
    newUrl.save(function (err) {
        if (err) res.status(403).json({
            'error': 'Name already taken or another error inserting'
        });
        res.status(201).json({
            'message': 'inserted'
        });
    });
});

// start listening
app.listen(port, () => console.log('Example app listening on port ' + port + '!'));