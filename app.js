const express = require('express');
const path = require('node:path');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const filesRouter = require('./routes/files');
const folderRouter = require('./routes/folder');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: false }));
app.use(session({
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}));
app.use(passport.session());

app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/folder/:folderId/file', filesRouter);
app.use('/folder', folderRouter);

app.get('*', (req, res) => {
  res.render('errorPage', {
    error: {
      status: 404,
      message: 'Page Not Found',
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));