var User = require("../models/userModel");
var ObjectId = require('mongoose').Types.ObjectId;
var jwt = require('jsonwebtoken');
var express = require('express');
var keys = require('../config.json')

var app = express();
app.set('superSecret', keys.appSecret);



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

  login: function(req, res, next) {
    User.find({}, function(err, users) {
      if(err) res.status(500).send(err)
    res.json(users);
  })
},

  auth: function(req, res, next) {

    // find the user
    User.findOne({
      username: req.body.username
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

        // check if password matches
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          // if user is found and password is right
          // create a token
          console.log(user)
          var token = jwt.sign(user, app.get('superSecret'), {
            // expiresInMinutes: 1440 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            user: user
          });
        }

      }

    });
    // for(var i = 0; i < users.length; i++) {
    //   if (users[i].name === req.body.userName && users[i].password === req.body.password) {
    //     req.session.currentUser = users[i];
    //     return res.send({ userFound: 'True' })
    //   }
    // }
    // res.send({ userFound: 'False' })
  }

  // show: (req, res, next) => {
  //   var id  = req.params.id;
  //   var $or = [ { username : id } ];
  //   // Does it look like an ObjectId? If so, convert it to one and
  //   // add it to the list of OR operands.
  //   if (ObjectId.isValid(id)) {
  //     $or.push({ _id : ObjectId(id) });
  //   }
  //   User.find({ $or : $or }).exec(function (err, collections) {
  //     if(err) console.log(err);
  //     res.json(collections);
  //   });
  // }

}
