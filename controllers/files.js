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

module.exports = {
  handleFileUpload,
  renderFileDetails,
}