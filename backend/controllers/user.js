var User = require("../models/userModel");
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = {

  create: function(req, res, next) {
    console.log(req.body)
    User.create(req.body, function(err, r){
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.status(200).json(r);
    })
  },

  show: (req, res, next) => {
    var id  = req.params.id;
    var $or = [ { username : id } ];
    // Does it look like an ObjectId? If so, convert it to one and
    // add it to the list of OR operands.
    if (ObjectId.isValid(id)) {
      $or.push({ _id : ObjectId(id) });
    }
    User.find({ $or : $or }).exec(function (err, collections) {
      if(err) console.log(err);
      res.json(collections);
    });
  }

}
