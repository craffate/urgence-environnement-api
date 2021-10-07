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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
