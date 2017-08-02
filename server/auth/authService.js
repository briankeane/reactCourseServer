const passport = require('passport');
const User = require('../api').User;
const config = require('../config/environment');
const JWT = require('passport-jwt');
const LocalStrategy = require('passport-local');

// setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: JWT.ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.appSecret
};

// Create JWT strategy
const jwtLogin = new JWT.Strategy(jwtOptions, function (payload, done) {
  // see if user ID exists
  User.findById(payload.sub)
  .then( 
    (user) => {
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Create local strategy
const localLogin = new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
  User.find({ where: { email: email }})
  .then(
    (foundUser) => {
      if (!foundUser) {
        done(null, false);
      } else {
        if (foundUser.authenticate(password)) {
          done(null, foundUser);
        } else {
          done(null, false);
        }
      }
    }
  );
});

// tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);