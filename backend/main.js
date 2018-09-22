// require packages
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const documents = require('./schemas/documents.js');

// get env variables - default values are temporary
const port = process.env.PORT || 3000;
const user = process.env.DB_USER || "chris";
const pass = process.env.DB_PASS || "chris1234";
const address = process.env.DB_ADDRESS || "ds245512.mlab.com:45512/50-50-links";

// create mongoose connection
mongoose.connect('mongodb://' + user + ':' + pass + '@' + address);

// provide frontend files
app.use(express.static("frontend"));

// Routes
// handle link access
app.get('/', (req, res) => res.redirect("/newLink.html"));
app.get('/:linkName', (req, res) => {
    documents.findOne({
        name: req.params.linkName
    }, function (err, doc) {
        if (err || !doc || !doc.urls) {
            res.status(404).json({
                'error': 'invalid link'
            });
        } else {
            res.status(301).redirect(doc.urls[Math.floor(Math.random() * (doc.urls.length + 1))]);
        }
    });
});

// handle link creation
app.post('/new', (req, res) => {
    let link = documents({
        name: req.params.name,
        urls: req.params.urls
    });

    link.save(function (err) {
        if (err)
            res.status(403).json({
                'error': 'failed to insert link'
            });

        res.status(201).json({
            'message': 'inserted'
        });
    });
});

// start listening
app.listen(port, () => console.log('Example app listening on port ' + port + '!'));