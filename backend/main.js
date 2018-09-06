const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const dbUrl = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds245512.mlab.com:45512';
const dbName = '50-50-links';

app.use(express.static("frontend"));

app.get('/', (req, res) => res.redirect("/newLink.html"));

app.get('/:linkName', handleLinkAccess);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

function handleLinkAccess(req, res) {
    MongoClient.connect(dbUrl, function (err, client) {
        if (err)
            res.sendStatus(503);

        const db = client.db(dbName);

        const collection = db.collection('documents');

        collection.find({name: req.params.linkName}).toArray(function (err, docs) {
            if(err)
                res.sendStatus(404);
            console.log("Found the following records");
            console.log(docs);
            res.json(docs);
        });

        client.close();
    });
}