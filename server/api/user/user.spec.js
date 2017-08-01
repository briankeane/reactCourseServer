var Connection = require('sequelize-connect');
var orm = new Connection(); // singleton pattern - returns the created instance
// orm.then(function () {
  // 
// })
var sequelize = orm.sequelize;
var Sequelize = orm.Sequelize;
var models    = orm.models;
console.log('orm:');
console.log(JSON.stringify(orm,0,2));
// var User      = models.User;

describe('A user', function () {
  it.only ('saves email and password', function (done) {
    this.timeout(12000);
    setTimeout(function () {

    var newOrm = new Connection();

    console.log(newOrm.models);
    console.log(newOrm.models.User);
    console.log('here');
    newOrm.models.User.create({ email: 'bob@bob.com', password: 'bobsPassword' })
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