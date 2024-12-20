const bcrypt = require('bcryptjs');
const db = require('../prisma/queries');
const { body, validationResult } = require('express-validator');

function renderSignUp(req, res) {
  res.render('signUp');
}

const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 255 characters';
const emptyErr = 'required';
const minLengthErr = 'must be at least 6 characters';
const validateSignUp = [
  [
    body('firstName').optional({checkFalsy: true}).trim()
      .isAlpha().withMessage(`First name ${alphaErr}`)
      .isLength({ min: 1, max: 255 }).withMessage(`First name ${lengthErr}`),
    body('lastName').optional({checkFalsy: true}).trim()
      .isAlpha().withMessage(`Last name ${alphaErr}`)
      .isLength({ min: 1, max: 255 }).withMessage(`Last name ${lengthErr}`),
    body('username').trim()
      .notEmpty().withMessage(`Username ${emptyErr}`)
      .isLength({ min: 6 }).withMessage(`Username ${minLengthErr}`),
    body('password')
      .notEmpty().withMessage(`Password ${emptyErr}`)
      .isLength({ min: 6 }).withMessage(`Password ${minLengthErr}`),
    body('confirmPassword')
      .notEmpty().withMessage(`Confirm password ${emptyErr}`)
      .custom((value, {req}) => {
        return value === req.body.password;
      }).withMessage('Confirm password does not match'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('signUp', {
        errors: errors.array(),
      });
    }
    next();
  }
];

async function handleSignUp(req, res, next) {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      await db.createUser(req.body, hashedPassword);
      res.redirect('/');
    });
  } catch (err) {
    return next(err);
  }
}

function renderLogIn(req, res) {
  res.render('logIn');
}

const validateLogIn = [
  [
    body('username').trim()
      .notEmpty().withMessage(`Username ${emptyErr}`)
      .isLength({ min: 6 }).withMessage(`Username ${minLengthErr}`),
    body('password')
      .notEmpty().withMessage(`Password ${emptyErr}`)
      .isLength({ min: 6 }).withMessage(`Password ${minLengthErr}`),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('logIn', {
        errors: errors.array(),
      });
    }
    next();
  }
];

function handleLogOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}

module.exports = {
  renderSignUp,
  validateSignUp,
  handleSignUp,
  renderLogIn,
  validateLogIn,
  handleLogOut,
}