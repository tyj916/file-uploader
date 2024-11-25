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
  const { folderId } = req.params;

  if (folderId) {
    res.locals.folder = await db.getFolderByFolderId(folderId);
  } else {
    if (req.user) {
      const user = req.user;
      res.locals.folder = await db.getRootFolderByOwnerId(user.id);
    }
  }

  next();
}

module.exports = {
  handleCreateFolder,
  getFolder,
}