const { Router } = require('express');
const folderController = require('../controllers/folder');
const folderRouter = Router();

folderRouter.post('/create', folderController.handleCreateFolder);
folderRouter.get('/:folderId', 
  folderController.getFolder,
  folderController.renderFolder,
);
folderRouter.get('/:folderId/edit', folderController.renderEditFolder);
folderRouter.post('/:folderId/edit', folderController.handleEditFolder);
folderRouter.post('/:folderId/delete', folderController.handleDeleteFolder);

module.exports = folderRouter;