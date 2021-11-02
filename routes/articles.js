'use strict';

const router = require('express').Router();
const Article = require('../models/article');
const Category = require('../models/category');

router.param('articleId', async (req, res, next, id) => {
  req.article = await Article.findByPk(id);

  next();
});

router.route('/')
.get(async (req, res) => {
  let ret;

  if (req.query.categoryId) {
    const category = await Category.findByPk(req.query.categoryId);
    ret = await category.getArticles();
  } else {
    ret = await Article.findAll();
  }

  res.status(200).json(ret);
})
.post(async (req, res) => {
  const ret = await Article.create(req.body);

  res.status(200).json(ret);
});

router.route('/:articleId')
.get((req, res) => {
  res.status(200).json(req.article);
})
.patch(async (req, res) => {
  await req.article.update(req.body);
  
  res.status(200).send();
})
.delete(async (req, res) => {
  await req.article.destroy();

  res.status(200).send();
});

module.exports = router;