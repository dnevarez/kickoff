var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var passport = require('passport');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var FacebookStrategy = require('passport-facebook').Strategy;
var eventCtrl = require('./controllers/eventCtrl');
var keys = require('./config.json')
var userCtrl = require('./controllers/user');
var middleware = require('./controllers/middlewareController');


var app = express();
var corsOptions = {
  origin: 'http://localhost:8100'
};

mongoose.set("debug", true);
mongoose.connect(keys.database);
mongoose.connection.once("open", function(){
  console.log("Connected to MongoDB");
});
app.set('superSecret', keys.appSecret);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(cors(corsOptions));
app.use(session({
  secret: keys.appSecret,
  resave: true,
  saveUninitialized: true
}));



// End points for login/signup
app.post('/signup', userCtrl.create)
app.post('/login', userCtrl.login)
app.post('/authenticate', userCtrl.auth);


//Everything after the authToken requires a token.

// app.use(middleware.authToken)



// End points for events.
// app.get('/event/:id', eventCtrl.show);
app.get('/event/:user', eventCtrl.index);
app.post('/event', eventCtrl.create);
app.put('/event/:id', eventCtrl.update);
app.delete('/delete/:id', eventCtrl.delete);





app.listen(3000, function() {
  console.log('The cake is a lie')
})
