"use strict";

const express = require("express");
const app = express();
const port = 3000;

const articles = require("./mock-articles.json");

app.all("*", (req, res, next) => {
  const now = new Date();

  console.log(`[${now.toUTCString()}] ${req.originalUrl} requested from ${req.hostname} (${req.ip})`);
  next();
});

app.get("/articles", (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.status(200).json(articles);
});

app.get("/articles/:id", (req, res) => {
  let article = articles.filter(el => el.id == req.params.id);

  res.header('Access-Control-Allow-Origin', '*');
  if (Object.keys(article).length > 0) {
    res.status(200).json(article);
  }
  res.status(404).send();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
