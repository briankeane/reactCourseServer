const passport = require('passport');
const User = require('../api').User;
const config = require('../config/environment');
const JWT = require('passport-jwt');

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


// tell passport to use the strategy
passport.use(jwtLogin);