var Event = require('../models/event');
var mongoose = require('mongoose')
// var ObjectId = require('mongoose').Types.ObjectId;
// var obj_id = BSON.ObjectID.createFromHexString("4fcfd7f246e1464d05000001");



module.exports = {

  create: function(req, res, next) {
    Event.create(req.body, function(err, r){
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.status(200).json(r);
    })
  },

  index: function(req, res, next) {
    console.log('params are ',req.params.user);
    var user = req.params.user;
    var userid = user.toString();
    console.log(userid)
    // var searchdate = req.params.search_date;
    // for (let i = 0; i < req.params.)
    Event.find({ user : userid }, function(err, r) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      console.log(r)
      res.status(200).json(r)
    })
  },

  show: (req, res, next) => {
    var id  = req.params.id;
    console.log(req.params.id)
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
  },

  update: (req, res, next) => {
    Event.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, r) {
      if (err) res.status(500).send(err);
      res.status(200).json(r)
    })
  },

  delete: (req, res, next) => {
    Event.findByIdAndRemove(req.params.id, function(err, r){
      if (err) res.status(500).send(err);
      r.remove();
      res.status(200).json(r)
    })
  }

}
