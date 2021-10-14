"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const mariadb = require("mariadb");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const secrets = require("./secrets.js");
const app = express();
const port = 3000;

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

app.post("/articles", async (req, res) => {
  const ret = await dbQuery(`INSERT INTO articles (name, subtitle, description, price)
  VALUES ('${req.body.name}', '${req.body.subtitle}', '${req.body.description}', ${req.body.price})`);
  
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
  SET name='${req.body.name}', subtitle='${req.body.subtitle}', description='${req.body.description}', price=${req.body.price} WHERE id=(${req.params.id})`);

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
      let token = jwt.sign({ subject: usr[0].id }, secrets.SHARED_SECRET);

      res.header('Authorization', 'Bearer ' + token)
      res.header('Access-Control-Expose-Headers', 'Authorization');
      res.status(200).send();
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (err) {
    res.status(401).send("Invalid user");
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
