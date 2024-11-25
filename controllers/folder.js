const db = require('../prisma/queries');

async function handleCreateFolder(req, res, next) {
  try {
    await db.createFolder(req.body.folderName, req.user);
    // res.redirect(`${req.body.folderName}`);
    res.redirect('/');
  } catch(err) {
    next(err);
  }
}

async function getFolder(req, res, next) {
  const user = req.user;
  const { folderId } = req.params;

  const folder = folderId ? await db.getFolderByFolderId(folderId) : await db.getRootFolderByOwnerId(user.id);
  res.locals.folder = folder;

  next();
}

module.exports = {
  handleCreateFolder,
  getFolder,
}