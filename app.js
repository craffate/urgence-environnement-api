"use strict";

const secrets = require("./secrets.js");
const https = require("https");
const fs = require("fs");
const express = require("express");
const sequelize = require('./db');
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bcrypt = require("bcrypt");
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

app.all("*", (req, res, next) => {
  const now = new Date();

  console.log(`[${now.toUTCString()}] ${req.originalUrl} requested from ${req.hostname} (${req.ip})`);
  next();
});

app.post("/img/articles/:id", upload.single("article"), async (req, res) => {
  const article = await Article.findByPk(req.params.id);

  article.createImage(req.file);

  res.status(200).send();
});

app.delete("/img/articles/:id", async (req, res) => {
  await Image.destroy({
    where: {
      id: req.params.id
    }
  });

  res.status(200).send();
});

app.get("/img/articles/:id", async (req, res) => {
  const ret = await Image.findByPk(req.params.id);

  res.status(200).json(ret);
});

app.post("/auth/signup", async (req, res) => {
  bcrypt.hash(req.body.password, secrets.BCRYPT_SALTROUNDS, (err, hash) => {
    req.body.password = hash;
    User.create(req.body);
  });

  res.status(201).send();
});

app.post("/auth/signin", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        'username': req.body.username
      }
    });
    const match = await bcrypt.compare(req.body.password, user.password);
  
    if (match) {
      req.session.user = { 'id': user.id, 'username': user.username, 'role': user.role };
      res.status(200).send('OK');
    } else {
      res.status(401).send();
    }
  } catch (err) {
    if (err instanceof TypeError) {
      res.status(401).send();
    }
    res.status(500).send();
  }
});

app.post("/auth/signout", async (req, res) => {
  req.session.destroy();
  
  res.clearCookie('sid');
  res.status(200).send();
});

app.get("/session", async (req, res) => {
  res.status(200).json(req.session.user);
});

https.createServer(httpsOptions, app).listen(port, async () => {
  try {
    console.log('Synchronizing Sequelize models...');
    await sequelize.sync({
      force: env === 'production' ? false : true,
      alter: env === 'production' ? false : true,
    });
    if (env === 'dev') {
      require('./fixtures/users');
      require('./fixtures/articles');
    }
  } catch (err) {
    console.error(err);
  }
  console.log(`Listening on port ${port}`);
});
