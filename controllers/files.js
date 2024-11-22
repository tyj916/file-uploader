const db = require('../prisma/queries');

function handleFileUpload(req, res) {
  console.log(req.files);
  res.redirect('/');
}

module.exports = {
  handleFileUpload,
}