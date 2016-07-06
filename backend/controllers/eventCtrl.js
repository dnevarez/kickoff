var Event = require('../models/event');
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = {

  create: function(req, res, next) {
    console.log("req is ", req.body)
    Event.create(req.body, function(err, r){
      if (err) {
        console.log(err);
        return status.res(500).send(err);
      }
      res.status(200).json(r);
    })
  },

  index: function(req, res, next) {
    Event.find(req.body, function(err, r) {
      if (err) {
        console.log(err);
        return status.res(500).send(err);
      }
      res.status(200).json(r)
    })
  },

  show: (req, res, next) => {
    var id  = req.params.id;
    console.log(id)
    var $or = [ { searchDate : id } ];
    // Does it look like an ObjectId? If so, convert it to one and
    // add it to the list of OR operands.
    if (ObjectId.isValid(id)) {
      $or.push({ _id : ObjectId(id) });
    }
    Event.find({ $or : $or }).exec(function (err, collections) {
      if(err) console.log(err);
      res.json(collections);
    });
  }

}
