const { Router } = require('express');
const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
  });
});

indexRouter.get('/add-new', (req, res) => {
  res.render('addNew', {
    user: req.user,
  });
})

module.exports = indexRouter;