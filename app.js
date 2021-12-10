'use strict';

const secrets = require('./secrets.js');
const express = require('express');
const sequelize = require('./db');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

require('./models/user');
const Article = require('./models/article');
const Image = require('./models/image');
const Category = require('./models/category');

Article.hasMany(Image);
Image.belongsTo(Article);
Category.hasMany(Article);
Article.belongsTo(Category);


const sessionStore = new SequelizeStore({
  db: sequelize,
});

sessionStore.sync();

app.use(session({
  secret: secrets.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  name: 'sid',
  store: sessionStore,
  cookie: {
    secure: false,
    httpOnly: false,
  },
}));
app.use(bodyParser.urlencoded({limit: secrets.MAX_BODY_SIZE, extended: true}));
app.use(bodyParser.json({limit: secrets.MAX_BODY_SIZE}));
app.use(cors({
  origin: ['http://localhost:4200'],
  credentials: true,
}));

app.use('/articles', require('./routes/articles'));
app.use('/users', require('./routes/users'));
app.use('/images', require('./routes/images'));
app.use('/auth', require('./routes/auth'));
app.use('/categories', require('./routes/categories'));

app.use('/static/', express.static('./static'));

app.listen(port, 'localhost', async () => {
  console.log(`Listening on port ${port}`);
});
