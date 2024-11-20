const { Router } = require('express');
const indexRouter = Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

indexRouter.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
  });
});
indexRouter.post('/upload', upload.array('uploadedFiles'), (req, res) => {
  console.log(req.file, req.body);
  res.redirect('/');
});

module.exports = indexRouter;