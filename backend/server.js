var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var passport = require('passport');
// var FacebookStrategy = require('passport-facebook').Strategy;
var eventCtrl = require('./controllers/eventCtrl');
var keys = require('./config.json')
var userCtrl = require('./controllers/user');

var app = express();
var corsOptions = {
  origin: 'http://localhost:8100'
};

mongoose.set("debug", true);
mongoose.connect('mongodb://localhost/planner');
mongoose.connection.once("open", function(){
  console.log("Connected to MongoDB");
});

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors(corsOptions));
app.use(session({
  secret: keys.appSecret,
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());


var requireAuth = (req, res, next) => {
  if(req.isAuthenticated()) {
    console.log(req.body);
    return next();
  }
  return res.redirect('/login');
};


var loggedInUser;
// passport.use(new FacebookStrategy({
//   clientID: keys.facebookAppId,
//   clientSecret: keys.facebookSecret,
//   callbackURL: 'http://localhost:3000/auth/facebook/callback'
// }, (token, tokenSecret, profile, done) => {
//
//   User.findOne({fbID: profile.id}, (err, user) => {
//
//     return user;
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({
//         name: profile.displayName,
//         email: faker.internet.email(),
//         password: faker.internet.password(),
//         fbID: profile.id
//       })
//     } else {
//       return user;
//     }
//
//   })
//   .then(user => {
//     loggedInUser = user;
//     done(null, user)
//   })
//   .catch(err => { console.log(err) });
//
// }))

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  console.log(obj);
  done(null, obj);
});











// End points for events.
app.get('/event/:id', eventCtrl.show);
app.get('/event', eventCtrl.index);
app.post('/event', eventCtrl.create);
app.put('/event/:id', eventCtrl.update);
app.delete('/event/:id', eventCtrl.delete);

// End points for login/signup
app.post('/signup', userCtrl.create)
app.get('/login/:id', userCtrl.show)

app.listen(3000, function() {
  console.log('The cake is a lie')
})
