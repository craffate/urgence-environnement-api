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
const Category = require('./models/category')

Article.hasMany(Image);
Category.hasMany(Article);
Article.belongsTo(Category);

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
  unset: 'keep',
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

app.all("*", (req, res, next) => {
  const now = new Date();

  console.log(`[${now.toUTCString()}] ${req.originalUrl} requested from ${req.hostname} (${req.ip})`);
  next();
});

app.get("/categories", async (req, res) => {
  const ret = await Category.findAll();

  res.status(200).json(ret);
});

app.get("/categories/:slug", async (req, res) => {
  const category = await Category.findOne({
    where: { slug: req.params.slug }
  });
  const ret = await category.getArticles();

  res.status(200).json(ret);
});

app.get("/articles", async (req, res) => {
    const ret = await Article.findAll();

    res.status(200).json(ret);
});

app.post("/articles/:categoryId", async (req, res) => {
  const category = await Category.findByPk(req.params.categoryId);
  const article = await category.createArticle(req.body);

    res.location(`/articles/${category.slug}/${article.id}`);
    res.status(201).send();
});

app.get("/articles/:id", async (req, res) => {
    const ret = await Article.findByPk(req.params.id);

    res.status(200).json(ret);
});

app.put("/articles/:id", async (req, res) => {
  const article = await Article.findByPk(req.params.id);

  await article.setCategory(req.body.categoryId);
  await article.update(req.body);

  res.status(200).send();
});

app.delete("/articles/:id", async (req, res) => {
  await Article.destroy({
    where: {
      'id': req.params.id
    }
  });

  res.status(200).send();
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
      req.session.authenticated = true;
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

https.createServer(httpsOptions, app).listen(port, async () => {
  try {
    console.log('Synchronizing Sequelize models...');
    await sequelize.sync({
      force: env === 'production' ? false : true,
      alter: env === 'production' ? false : true,
    });
    await Category.bulkCreate([
      { name: "Mobilier", slug: "mobilier", description: "Mobilier du classique comme futuriste" },
      { name: "Occasion", slug: "occasion", description: "Differents objets d'occasion" },
      { name: "Divers", slug: "divers" }
    ]);
  } catch (err) {
    console.error(err);
  }
  console.log(`Listening on port ${port}`);
});
