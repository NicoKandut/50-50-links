const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const url = 'mongodb://localhost:27017';
const dbName = 'myproject';

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));