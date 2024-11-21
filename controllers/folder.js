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

function renderFolder(req, res) {
  const { folderName } = req.params;
  res.render('folder', {
    folderName: folderName,
  });
}

module.exports = {
  handleCreateFolder,
  renderFolder,
}