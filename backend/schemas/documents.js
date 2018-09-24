const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    urls: {
      type: [String],
      required: true,
      validate: [arrayMin, 'Not enough urls']
    }
  }
);
/*documentSchema.pre('save', function(next){
  var newDoc = this;
  for(var i = 0; i < newDoc.urls.lenght; i++){
    if(newDoc.urls[i].substring(0,5) == "http:" || newDoc.urls[i].substring(0,6) == "https:") {
      switch(newDoc.urls[i].split(":")[0]){
        case "http":  if(!/.\..+\./g.test(newDoc.urls[i].split("//")[1] )) newDoc.urls[i] = "http://www." + newDoc.urls[i].split("://")[1];
                      break;
        case "https": if(!/.\..+\./g.test(newDoc.urls[i].split("//")[1] )) newDoc.urls[i] = "https://www." + newDoc.urls[i].split("://")[1];
                      break;
      }
    } else {
      if(!/.\..+\./g.test(newDoc.urls[i])) newDoc.urls[i] = "www." + newDoc.urls[i];
      newDoc.urls[i] = "http://" + newDoc.urls[i];
    }
  }
  next();
});*/

function arrayMin(val) {
  return val.length > 1;
}

const document = mongoose.model('documents', documentSchema);
module.exports = document;
