const { Router } = require('express');
const multer = require('multer');
const filesController = require('../controllers/files');

const filesRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

filesRouter.post('/upload', 
  upload.array('uploadedFiles'), 
  filesController.handleFileUpload,
);
filesRouter.get('/:fileId', filesController.renderFileDetails);
filesRouter.get('/:fileId/edit', filesController.renderEditFile);
filesRouter.post('/:fileId/edit', filesController.handleEditFile);
filesRouter.post('/:fileId/delete', filesController.handleDeleteFile);
filesRouter.get('/:fileId/download', filesController.handleDownloadFile);

module.exports = filesRouter;