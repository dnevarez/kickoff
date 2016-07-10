var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = {
  date: {
    month: {type: Number, required: true},
    day: {type: Number, required: true},
    year: {type: Number, required: true}
  },
  plan: {type: String, required: true},
  start: {type: Number, required: true},
  ampm: {type: String, required: true},
  duration: {type: Number},
  searchDate: {type: Number},
  user: {type: String, required: true, ref: 'User'}
}

module.exports = mongoose.model('Event', eventSchema)
