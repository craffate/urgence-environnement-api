"use strict";

const secrets = require("./secrets.js");
const https = require("https");
const fs = require("fs");
const express = require("express");
const sequelize = require('./db');
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: secrets.STATIC_FOLDER });
const app = express();
const port = 3000;
const env = app.get('env');

const User = require('./models/user');
const Article = require('./models/article');
const Image = require('./models/image');
const Category = require('./models/category');
const Order = require('./models/order');

Article.hasMany(Image);
Category.hasMany(Article);
Article.belongsTo(Category);
Order.hasMany(Article);
Order.belongsTo(User);
User.hasMany(Order);

const httpsOptions = {
  key: fs.readFileSync(secrets.SSL_KEY),
  cert: fs.readFileSync(secrets.SSL_CERT)
}

const sessionStore = new SequelizeStore({
  db: sequelize
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
    secure: true,
    httpOnly: false
  }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://localhost:4200'],
  credentials: true
}));

app.use('/articles', require('./routes/articles'));
app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));
app.use('/images', require('./routes/images'));
app.use('/profile', require('./routes/profile'));
app.use('/auth', require('./routes/auth'));

app.use('/static/', express.static('./static'));

app.all("*", (req, res, next) => {
  const now = new Date();

  console.log(`[${now.toUTCString()}] ${req.originalUrl} requested from ${req.hostname} (${req.ip})`);
  next();
});

https.createServer(httpsOptions, app).listen(port, async () => {
  console.log(`Listening on port ${port}`);
});
