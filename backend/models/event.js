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
  duration: {type: Number, required: true},
  searchDate: {type: Number}
}

module.exports = mongoose.model('Event', eventSchema)
