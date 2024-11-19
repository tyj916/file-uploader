const { Router } = require('express');
const authRouter = Router();

authRouter.get('/sign-up', (req, res) => {
  res.render('signUp');
});

module.exports = authRouter;