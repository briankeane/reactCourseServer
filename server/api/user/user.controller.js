const db = require('../');


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
      return res.status(200).send(savedUser);
    });
  });
}