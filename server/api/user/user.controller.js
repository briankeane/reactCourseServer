const db = require('../');


exports.create = function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.status(422).send({ message: 'missing parameter: email or password '});
  }
  db.User.findAll({ where: { email: req.body.email.toLowerCase() } })
  .then(function (foundUser) {
    if (foundUser && foundUser.length) {
      return res.status(422).send({ message: 'email is already in use' });
    }
    db.User.create({ email: req.body.email, password: req.body.password })
    .then(function (savedUser) {
      return res.status(200).send(savedUser);
    })
  })
}