const { Router } = require('express');
const folderController = require('../controllers/folder');
const folderRouter = Router();

folderRouter.post('/create', folderController.handleCreateFolder);
folderRouter.get('/:folderId', folderController.getFolder);

module.exports = folderRouter;