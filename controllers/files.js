require('dotenv').config();
const path = require('node:path');
const fs = require('fs');
const https = require('https');
const cloudinary = require('cloudinary').v2;
const db = require('../prisma/queries');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

async function handleFileUpload(req, res) {
  const user = req.user;
  const { files } = req;
  const folderId = req.params.currentFolderId || (await db.getRootFolderByOwnerId(user.id)).id;
  const promises = [];

  files.forEach(async (file) => {
    promises.push(new Promise(async (resolve, reject) => {
      try {
        const cloudRes = await cloudinary.uploader.upload(file.path, {
          resource_type: 'auto',
        });

        await db.insertFile(file, cloudRes, user.id, folderId);
        resolve();
      } catch(err) {
        console.error(err);
        reject();
      }
    }));
  });

  await Promise.all(promises);
  res.redirect(`/folder/${folderId}`);
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
  const removedFile = await db.removeFileById(fileId);
  
  try {
    await cloudinary.uploader.destroy(fileId, {resource_type: removedFile.type});
  } catch(err) {
    console.error(err);
  }

  res.redirect(`/folder/${removedFile.folderId}`);
}

async function handleDownloadFile(req, res) {
  const { fileId } = req.params;
  const file = await db.getFileDetailsById(fileId);
  https.get(file.URL, (response) => {
    res.set('Content-Disposition', `attachment; filename=${file.name}`);
    response.pipe(res);
  });
}

module.exports = {
  handleFileUpload,
  renderFileDetails,
  renderEditFile,
  handleEditFile,
  handleDeleteFile,
  handleDownloadFile,
}