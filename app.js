"use strict";

const secrets = require("./secrets.js");
const express = require("express");
const bcrypt = require("bcrypt");
const mariadb = require("mariadb");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: secrets.STATIC_FOLDER });
const app = express();
const port = 3000;
const env = app.get('env');

const pool = mariadb.createPool({
     host: secrets.SQL_HOST, 
     user: secrets.SQL_USER, 
     password: secrets.SQL_PASSWORD,
     database: secrets.SQL_DB,
     connectionLimit: 5
});

async function dbQuery(query) {
  let conn;
  let ret;

  try {
    conn = await pool.getConnection();
    ret = await conn.query(query);
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.end();
    return ret;
  }
}

async function dbQueryUser(user) {
  return dbQuery(`SELECT * FROM users WHERE username=('${user}')`);
}

app.use(session({
  secret: secrets.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  unset: 'keep',
  name: 'sid',
  store: env === 'production' ? sessionStore : new session.MemoryStore,
  cookie: {
    secure: env === 'production' ? true : false,
  }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.all("*", (req, res, next) => {
  const now = new Date();

  console.log(`[${now.toUTCString()}] ${req.originalUrl} requested from ${req.hostname} (${req.ip})`);
  next();
});

app.get("/articles", async (req, res) => {
  const ret = await dbQuery("SELECT * FROM articles");

  res.status(200).json(ret);
});

app.get("/categories", async (req, res) => {
  const ret = await dbQuery("SELECT * FROM categories");

  res.status(200).json(ret);
});

app.post("/articles", async (req, res) => {
  const ret = await dbQuery(`INSERT INTO articles (name, subtitle, description, price, category_id)
  VALUES ('${req.body.name}', '${req.body.subtitle}', '${req.body.description}', ${req.body.price}, ${req.body.category_id})`);
  
  if (ret.affectedRows === 0) {
    res.status(204).send();
  } else {
    res.location(`/articles/${ret.insertId}`)
    res.status(201).send();
  }
});

app.get("/articles/:id", async (req, res) => {
  const ar = await dbQuery(`SELECT * FROM articles WHERE id=(${req.params.id})`);

  if (ar.length === 0) {
    res.status(404).send();
  } else {
    res.status(200).json(ar[0]);
  }
});

app.put("/articles/:id", async (req, res) => {
  const ret = await dbQuery(`UPDATE articles 
  SET name='${req.body.name}', subtitle='${req.body.subtitle}', description='${req.body.description}', price=${req.body.price}, category_id=${req.body.category_id} WHERE id=(${req.params.id})`);

  if (ret.affectedRows === 0) {
    res.status(204).send();
  } else {
    res.location(`/articles/${req.params.id}`)
    res.status(200).send();
  }
});

app.delete("/articles/:id", async (req, res) => {
  const ret = await dbQuery(`DELETE FROM articles WHERE id=(${req.params.id})`);

  if (ret.affectedRows === 0) {
    res.status(204).send();
  } else {
    res.status(200).send("Resource deleted");
  }
});

app.post("/img/articles/:id", upload.single("article"), async (req, res) => {
  if (!req.file) {
    res.status(204).send();
  } else {
    const ret = await dbQuery(`INSERT INTO images (filename, mimetype, article_id)
    VALUES ('${req.file.filename}', '${req.file.mimetype}', ${req.params.id});`);

    if (ret.affectedRows === 0) {
      res.status(204).send();
    }
    res.status(200).send();
  }
});

app.delete("/img/articles/:id", async (req, res) => {
  const ret = await dbQuery(`DELETE FROM images WHERE id=(${req.params.id})`);

  if (ret.affectedRows === 0) {
    res.status(204).send();
  } else {
    res.status(200).send("Resource deleted");
  }
});

app.get("/img/articles/:id", async (req, res) => {
  const ar = await dbQuery(`SELECT * FROM images WHERE article_id=(${req.params.id})`);
  let ret = await ar.map(el => `/${secrets.STATIC_FOLDER}/${el.filename}`);

  res.status(200).json(ret);
});

app.post("/auth/signup", async (req, res) => {
  const ar = await dbQueryUser(req.body.username);

  if (ar.length === 0) {
    bcrypt.hash(req.body.password, secrets.BCRYPT_SALTROUNDS, (err, hash) => {
      dbQuery(`INSERT INTO users (username, password, role)
      VALUES ('${req.body.username}', '${hash}', ${req.body.role});`);
      res.status(201).send("Registered successfully");
    });
  } else {
    res.status(418).send("User already exists");
  }
});

app.post("/auth/signin", async (req, res) => {
  const usr = await dbQueryUser(req.body.username);

  try {
    const match = await bcrypt.compare(req.body.password, usr[0].password);
  
    if (match) {
      req.session.authenticated = true;
      res.status(200).send('OK');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
