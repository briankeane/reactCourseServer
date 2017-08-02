const express = require('express');
const controller = require('./user.controller');
const authService = require('../../auth/authService');
const passport = require('passport');

const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false });


router.post('/', controller.create);
router.get('/', requireAuth, function (req, res) {
  res.send({ hello: 'world' });
});

module.exports = router;