const { Router } = require('express');
const filesRouter = Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

filesRouter.post('/upload', 
  upload.array('uploadedFiles'), 
  (req, res) => {
    console.log(req.files);
    res.redirect('/');
  },
);

module.exports = filesRouter;