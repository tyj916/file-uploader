const db = require('../prisma/queries');

async function handleFileUpload(req, res) {
  const user = req.user;
  const folderId = req.params.currentFolderId || (await db.getRootFolderByOwnerId(user.id)).id;
  await db.uploadFiles(req.files, user.id, folderId);

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
  const newName = req.body.name;
  const { folderId } = await db.updateFile(fileId, newName);
  res.redirect(`/folder/${folderId}/file/${fileId}`);
}

async function handleDeleteFile(req, res) {
  const { fileId } = req.params;
  const { folderId } = await db.removeFileById(fileId);
  res.redirect(`/folder/${folderId}`);
}

module.exports = {
  handleFileUpload,
  renderFileDetails,
  renderEditFile,
  handleEditFile,
  handleDeleteFile,
}