const db = require('../prisma/queries');

async function handleCreateFolder(req, res, next) {
  try {
    const { folderName } = req.body;
    const currentUser = req.user;
    const parentFolderId = req.params.folderId || (await db.getRootFolderByOwnerId(currentUser.id)).id;

    await db.createFolder(folderName, currentUser.id, parentFolderId);
    res.redirect(`/folder/${parentFolderId}`);
  } catch(err) {
    next(err);
  }
}

async function getFolder(req, res, next) {
  const { folderId } = req.params;

  if (folderId) {
    res.locals.folder = await db.getFolderByFolderId(+folderId);
  } else {
    if (req.user) {
      const user = req.user;
      res.locals.folder = await db.getRootFolderByOwnerId(user.id);
    }
  }

  next();
}

function renderFolder(req, res) {
  res.render('index', {
    user: req.user,
    folder: res.locals.folder,
  });
}

module.exports = {
  handleCreateFolder,
  getFolder,
  renderFolder,
}