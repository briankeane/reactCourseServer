var db    = require('../');

// var User      = models.User;

describe('A user', function () {
  it.only ('saves email and password', function (done) {
    this.timeout(12000);
    setTimeout(function () {

    db.User.create({ email: 'bob@bob.com', password: 'bobsPassword' })
    .then(function (savedPerson) {
      console.log('saved person:');
      console.log(savedPerson);
      expect(savedPerson.email).to.equal('bob@bob.com');
      expect(savedPerson.password).to.equal('bobsPassword');
      done();
    }).catch(function (err) {
      console.log('err saving');
      console.log(err);
    });
    },3000);
  });
});