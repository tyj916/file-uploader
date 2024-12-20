const { Router } = require('express');
const folderController = require('../controllers/folder');
const indexRouter = Router();

indexRouter.get('/',
  (req, res, next) => {
    if (!req.user) {
      res.render('index');
    } else {
      next();
    }
  },
  folderController.getFolder,
  folderController.renderFolder,
);

indexRouter.get('/add-new', (req, res) => {
  res.render('addNew', {
    user: req.user,
  });
})

module.exports = indexRouter;