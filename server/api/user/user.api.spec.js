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
                id: res.body.id
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
});