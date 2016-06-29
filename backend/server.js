var express = require('express');
var mongoose = require('mongoose');

var app = express();




mongoose.set("debug", true);
mongoose.connect('mongodb://localhost/planner');
mongoose.connection.once("open", function(){
  console.log("Connected to MongoDB");
});


app.listen(3000, function() {
  console.log('The cake is a lie')
})
