const bcrypt = require('bcryptjs');
const db = require('../prisma/queries');

function renderSignUp(req, res) {
  res.render('signUp');
}

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

module.exports = {
  renderSignUp,
  handleSignUp,
}