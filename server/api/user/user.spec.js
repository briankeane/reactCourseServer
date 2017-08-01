var db    = require('../');
var db  = require('../');
var expect = require('chai').expect;


describe('A user', function () {
  beforeEach(function (done) {
    db.User.destroy({ where : {} }) // drops table and re-creates it
    .then(function() {
      done();
    })
    .error(function(error) {
      done(error);
    });
  });

  it.only ('saves email and password', function (done) {
    db.User.create({ email: 'bob@bob.com', password: 'bobsPassword' })
    .then(function (savedPerson) {
      expect(savedPerson.email).to.equal('bob@bob.com');
      expect(savedPerson.password).to.equal('bobsPassword');
      done();
    }).catch(function (err) {
      console.log('err saving');
      console.log(err);
      done(err);
    });
  });
});