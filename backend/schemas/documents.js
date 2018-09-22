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

function arrayMin(val) {
  return val.length > 1;
}

const document = mongoose.model('documents', documentSchema);
module.exports = document;
