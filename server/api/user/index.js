const express = require('express');
const controller = require('./user.controller');
const authService = require('../../auth/authService');
const passport = require('passport');

const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false });
const verifyLocalLogin = passport.authenticate('local', { session: false });


router.post('/', controller.create);
router.post('/login', verifyLocalLogin, controller.login);

module.exports = router;