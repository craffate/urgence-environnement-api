"use strict";

const fs = require("fs");
const express = require("express");
const mariadb = require('mariadb');
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

  res.location(`/articles/${ret.insertId}`)
  res.status(201).send("Created");
});

app.get("/articles/:id", async (req, res) => {
  const ar = await dbQuery(`SELECT * FROM articles WHERE id=(${req.params.id})`);

  if (ar.length === 0) {
    res.status(404).send("Not found");
  } else {
    res.status(200).json(ar[0]);
  }
});

app.post("/articles/:id", async (req, res) => {
  const ret = await dbQuery(`UPDATE articles 
  SET name='${req.body.name}', subtitle='${req.body.subtitle}', description='${req.body.description}', price=${req.body.price} WHERE id=(${req.params.id})`);

  res.location(`/articles/${req.params.id}`)
  res.status(201).send("Updated");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
