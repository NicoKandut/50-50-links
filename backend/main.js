const express = require('express');
const mongoose = require('mongoose');
const app = express();
const documents = require('./schemas/documents.js');
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

mongoose.connect('mongodb://' + process.env.USER + ':' + process.env.PASSWORD + '@' + process.env.DBLINK);
app.use(express.static("frontend"));

app.get('/', (req, res) => res.redirect("/newLink.html"));

app.get('/:linkName', handleLinkAccess);
app.post('/new', insertLink); 

app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'));

function handleLinkAccess(req, res) {
  let url = req.params.linkName;
  documents.findOne({name: url}, function(err, doc){
    if(!doc || !doc.urls) res.status(404).json({'error': 'Invalid linking name'});
    else{
      res.status(301).redirect(doc.urls[Math.floor(Math.random()*(doc.urls.length+1))]);
    }
  });
}

function insertLink(req, res){
  let url = req.body.name;
  let links = req.body.urls;
  for(let i = 0; i < links.length; i++){
    if(links[i].substring(0,5) == "http:" || links[i].substring(0,6) == "https:") {
      switch(links[i].split(":")[0]){
        case "http":  if(!/.\..+\./g.test(links[i].split("//")[1] )) links[i] = "http://www." + links[i].split("://")[1];
                      break;
        case "https": if(!/.\..+\./g.test(links[i].split("//")[1] )) links[i] = "https://www." + links[i].split("://")[1];
                      break;
      }
    } else {
      if(!/.\..+\./g.test(links[i])) links[i] = "www." + links[i];
      links[i] = "http://" + links[i];
    }
  }
  let newUrl = documents({
    name: url,
    urls: links
  });
  newUrl.save(function(err){
    if(err) res.status(403).json({'error': 'Name already taken or another error inserting'});
    else res.status(201).json({'message': 'inserted'});
  });
}
