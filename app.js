"use strict";

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all("*", (req, res, next) => {
  const now = new Date();

  console.log(`[${now.toUTCString()}] ${req.originalUrl} requested from ${req.hostname} (${req.ip})`);
  next();
});

app.all("/articles*", (req, res, next) => {
  req.articles = JSON.parse(fs.readFileSync('./mock-articles.json', 'utf8'));
  next();
});

app.get("/articles", (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.status(200).json(req.articles);
});

app.all("/articles/:id", (req, res, next) => {
  let article = req.articles.filter(el => el.id == req.params.id);

  res.header('Access-Control-Allow-Origin', '*');
  if (Object.keys(article).length > 0) {
    req.article = article;
    next();
  }
  res.status(404).send();
});

app.get("/articles/:id", (req, res) => {
  res.status(200).json(req.article[0]);
});

app.post("/articles/:id", (req, res) => {
  req.articles[req.params.id - 1] = req.body;
  fs.writeFile('./mock-articles.json', JSON.stringify(req.articles), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
