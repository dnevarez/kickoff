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
  plan: [ {type: String, ref: 'Event'} ]
}

module.exports = mongoose.model('User', userSchema)
