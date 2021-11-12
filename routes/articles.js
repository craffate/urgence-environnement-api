'use strict';

const router = require('express').Router();
const Op = require('sequelize').Op;
const Article = require('../models/article');
const Category = require('../models/category');
const Image = require('../models/image');

router.param('articleId', async (req, res, next, id) => {
  req.article = await Article.findByPk(id);

  next();
});

router.route('/')
    .get(async (req, res) => {
      const query = {
        attributes: ['id', 'sku', 'name', 'subtitle', 'description', 'price'],
        include: [Image],
      };

      if (req.query.category) {
        query.include.push({
          model: Category,
          attributes: [],
          where: {slug: req.query.category},
        });
      }
      if (req.query.name) {
        query['where'] = {
          name: {[Op.like]: '%' + req.query.name + '%'},
        };
      }
      res.status(200).json(await Article.findAll(query));
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
