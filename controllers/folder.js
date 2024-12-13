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
    currentFolderId: res.locals.folder.id,
    folder: res.locals.folder,
  });
}

async function renderEditFolder(req, res) {
  const folder = await db.getFolderByFolderId(req.params.folderId);
  res.render('editFolder', {
    user: req.user,
    folder: folder,
  });
}

async function handleEditFolder(req, res) {
  const { folderId } = req.params;
  const newName = req.body.name;
  await db.updateFolder(folderId, newName)
  res.redirect(`/folder/${folderId}`);
}

async function handleDeleteFolder(req, res) {
  const { folderId } = req.params;
  const parentId = (await db.getFolderByFolderId(folderId)).parentId;
  await db.removeFolderById(folderId);

  if (parentId) {
    res.redirect(`/folder/${parentId}`);
  } else {
    res.redirect('/');
  }
}

module.exports = {
  handleCreateFolder,
  getFolder,
  renderFolder,
  renderEditFolder,
  handleEditFolder,
  handleDeleteFolder,
}