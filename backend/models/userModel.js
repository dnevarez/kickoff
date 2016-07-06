var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = {
  username: {type: String, required: true, unique: true, index: true},
  name: {
    first: {type: String, required: true},
    last: {type: String, required: true}
    },
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, min: 8},
  day: [ {type: String, ref: 'Day'} ]
}

module.exports = mongoose.model('User', userSchema)
