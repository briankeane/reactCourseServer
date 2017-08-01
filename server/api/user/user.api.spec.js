var app = require('../../index');
var expect = require('chai').expect;
var request = require('supertest');
const db    = require('../');


describe('User', function () {
  beforeEach(function (done) {
    db.User.destroy({ where : {} }) // drops table and re-creates it
    .then(function() {
      done();
    })
    .error(function (err) {
      console.log(err);
      done(err);
    });
  });

  describe('Create', function () {
    it.only ('validates missing email', function (done) {
      request(app)
        .post('/api/v1/users')
        .send({ password: 'bobsPassword' })
        .expect(422)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            console.log('you have fucked up.');
            console.log(err);
            done(err);
          } else {
            expect(res.body.message).to.include('missing');
            done();
          }
        });
    });
  });
});