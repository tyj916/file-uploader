const db = require('../prisma/queries');

async function handleFileUpload(req, res) {
  const user = req.user;
  const folderId = req.params.currentFolderId || (await db.getRootFolderByOwnerId(user.id)).id;
  await db.uploadFiles(req.files, user.id, folderId);

  res.redirect('/');
}

module.exports = {
  handleFileUpload,
}