var app = require('../../index');
var expect = require('chai').expect;
var request = require('supertest');
const db    = require('../');


describe.only('User', function () {
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
    it ('validates missing email', function (done) {
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

    it ('validates missing password', function (done) {
      request(app)
        .post('/api/v1/users')
        .send({ email: 'bob@bob.com' })
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

    it ('rejects if email exists', function (done) {
      db.User.create({ email: 'bob@bob.com' })
      .then(function(savedUser) {
        request(app)
          .post('/api/v1/users')
          .send({ email: 'bob@bob.com', password: 'bobsPassword' })
          .expect(422)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) {
              console.log('you have fucked up.');
              console.log(err);
              done(err);
            } else {
              expect(res.body.message).to.include('email');
              done();
            }
          });
      });
    });

    it ('works', function (done) {
      request(app)
        .post('/api/v1/users')
        .send({ email: 'bob@bob.com', password: 'bobsPassword' })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            console.log('you have fucked up.');
            console.log(err);
            done(err);
          } else {
            db.User.findAll({
              where: {
                email: 'bob@bob.com'
              }
            })
            .then(function (foundUsers) {
              expect(foundUsers.length).to.equal(1);    
              expect(foundUsers[0].authenticate('bobsPassword')).to.equal(true);
              done();
            });
          }
        });
    });
  });

  describe('Sign In', function () {
    var user;

    beforeEach(function (done) {
      user = db.User.build({ email: 'bob@bob.com' });
      user.setPassword('bobsPassword');
      user.save()
      .then(function (savedUser) {
        user = savedUser;
        done();
      });
    });

    it ('rejects if email is incorrect', function (done) {
      request(app)
        .post('/api/v1/users/login')
        .send({ email: 'differentBob@bob.com', password: 'bobsPassword' })
        .expect(401)
        .end(function (err, res) {
          if (err) {
            console.log('you have fucked up.');
            console.log(err);
            done(err);
          } else {
            done();
          }
        });
    });

    it ('fails if email is not in the system', function (done) {
      request(app)
        .post('/api/v1/users/login')
        .send({ email: 'bob@bob.com', password: 'bobsWrongPassword' })
        .expect(401)
        .end(function (err, res) {
          if (err) {
            console.log('you have fucked up.');
            console.log(err);
            done(err);
          } else {
            done();
          }
        });
    });

    it ('logs in a user', function (done) {
      request(app)
        .post('/api/v1/users/login')
        .send({ email: 'bob@bob.com', password: 'bobsPassword' })
        .expect(200)
        .end(function (err, res) {
          if (err) {
            console.log('you have fucked up.');
            console.log(err);
            done(err);
          } else {
            expect(res.body.token).to.exist;
            done();
          }
        });
    });
  });
});