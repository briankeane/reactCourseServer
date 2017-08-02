const db = require('../');
const jwt = require('jwt-simple');
const config = require('../../config/environment');

function createUserToken(user) {
  const timestamp = new Date().getTime();         // JWT Conventions
  return jwt.encode({ sub: user.id,               // sub: subject of token
                      iat: new Date().getTime()   // iat: issued-at-time
                    }, config.appSecret);
}

exports.create = function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.status(422).send({ message: 'missing parameter: email or password '});
  }
  db.User.findAll({ where: { email: req.body.email.toLowerCase() } })
  .then(function (foundUsers) {
    if (foundUsers && foundUsers.length) {
      return res.status(422).send({ message: 'email is already in use' });
    }
    var user = db.User.build({ email: req.body.email })
    user.setPassword(req.body.password);
    user.save()
    .then(function (savedUser) {
      return res.status(200).send({ token: createUserToken(savedUser) });
    });
  });
}

exports.login = function (req, res, next) {
  // login info checked by passport middleware, so if they got this far they answered correctly
  return res.status(200).send({ token: createUserToken(req.user) });
}