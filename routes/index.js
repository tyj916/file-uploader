const { Router } = require('express');
const folderController = require('../controllers/folder');
const indexRouter = Router();

indexRouter.get('/',
  folderController.getFolder,
  folderController.renderFolder,
);

indexRouter.get('/add-new', (req, res) => {
  res.render('addNew', {
    user: req.user,
  });
})

module.exports = indexRouter;