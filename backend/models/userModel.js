var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = {
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, min: 8},
  // day: {ref: 'Day'}
}

module.exports = mongoose.model('User', userSchema)
