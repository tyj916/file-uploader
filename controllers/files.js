require('dotenv').config();
const path = require('node:path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const db = require('../prisma/queries');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

async function saveFilesToCloud(files) {
  const results = [];

  files.forEach(async (file) => {
    results.push(
      await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        public_id: file.name,
      })
    );
  })

  return results;
} 

async function handleFileUpload(req, res) {
  const user = req.user;
  const folderId = req.params.currentFolderId || (await db.getRootFolderByOwnerId(user.id)).id;
  await db.uploadFiles(req.files, user.id, folderId);
  const cloudRes = await saveFilesToCloud(req.files);
  console.log(cloudRes);

  res.redirect('/');
}

async function renderFileDetails(req, res) {
  const { fileId } = req.params;
  const file = await db.getFileDetailsById(fileId);
  res.render('fileDetails', {
    user: req.user,
    file: file,
  });
}

async function renderEditFile(req, res) {
  const { fileId } = req.params;
  const file = await db.getFileDetailsById(fileId);
  res.render('editFile', {
    user: req.user,
    file: file,
  });
}

async function handleEditFile(req, res) {
  const { fileId } = req.params;
  const oldName = (await db.getFileDetailsById(fileId)).name;
  const newName = req.body.name;
  const { folderId } = await db.updateFile(fileId, newName);
  fs.rename(
    `uploads/${oldName}`, 
    `uploads/${newName}`, 
    (err) => {
      console.error(err);
    },
  );
  res.redirect(`/folder/${folderId}/file/${fileId}`);
}

async function handleDeleteFile(req, res) {
  const { fileId } = req.params;
  const { folderId } = await db.removeFileById(fileId);
  res.redirect(`/folder/${folderId}`);
}

async function handleDownloadFile(req, res) {
  const { fileId } = req.params;
  const file = await db.getFileDetailsById(fileId);
  res.download(`uploads/${file.name}`);
}

module.exports = {
  handleFileUpload,
  renderFileDetails,
  renderEditFile,
  handleEditFile,
  handleDeleteFile,
  handleDownloadFile,
}