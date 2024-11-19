const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authController = require('../controllers/auth');

const authRouter = Router();

authRouter.get('/sign-up', authController.renderSignUp);
authRouter.post('/sign-up', authController.handleSignUp);

module.exports = authRouter;