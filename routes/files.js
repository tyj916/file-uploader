const { Router } = require('express');
const filesRouter = Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

filesRouter.post('/upload', upload.array('uploadedFiles'), (req, res) => {
  console.log(req.files);
  res.redirect('/');
});

module.exports = filesRouter;