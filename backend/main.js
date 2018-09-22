const express = require('express');
const mongoose = require('mongoose');
const app = express();
const documents = require('./schemas/documents.js');

mongoose.connect('mongodb://' + process.env.USER + ':' + process.env.PASSWORD + '@' + process.env.DBLINK);
app.use(express.static("frontend"));

app.get('/', (req, res) => res.redirect("/newLink.html"));

app.get('/:linkName', handleLinkAccess);
app.post('/new', insertLink); 

app.listen(3000, () => console.log('Example app listening on port 3000!'));

function handleLinkAccess(req, res) {
  let url = req.params.linkName;
  documents.findOne({name: url}, function(err, doc){
    if(err || !doc || !doc.urls) res.status(404).json({'error': 'Invalid linking name'});
    else{
      res.status(301).redirect(doc.urls[Math.floor(Math.random()*(doc.urls.length+1))]);
    }
  });
}

function insertLink(req, res){
  let url = req.params.name;
  let links = req.params.urls;
  let newUrl = documents({
    name: url,
    urls: links
  });
  newUrl.save(function(err){
    if(err) res.status(403).json({'error': 'Name already taken or another error inserting'});
    res.status(201).json({'message': 'inserted'});
  });
}
