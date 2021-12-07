'use strict';

const router = require('express').Router();
const Op = require('sequelize').Op;
const Article = require('../models/article');
const Category = require('../models/category');
const Image = require('../models/image');
const sequelize = require('../db');

router.param('articleId', async (req, res, next, id) => {
  const query = {
    attributes: ['id', 'sku', 'name', 'subtitle', 'description', 'price', 'quantity',
      'weight', 'weight_unit',
      'length', 'width', 'height', 'dimensions_unit', 'updated_at'],
    include: [
      {model: Category, attributes: ['id', 'name', 'slug', 'description']},
      {model: Image, attributes: ['id', 'filename', 'mimetype', 'path']},
    ],
  };

  req.article = await Article.findByPk(id, query);

  if (req.article === null) {
    res.status(404).send();
  } else {
    next();
  }
});

router.route('/')
    .get(async (req, res) => {
      let pageLimit = 10;
      const query = {
        attributes: ['id', 'sku', 'name', 'subtitle', 'description', 'price', 'quantity',
          'weight', 'weight_unit',
          'length', 'width', 'height', 'dimensions_unit', 'updated_at'],
        include: [{model: Image, attributes: ['id', 'filename', 'mimetype', 'path']}],
        limit: pageLimit,
        offset: 0,
        distinct: 'id',
        where: {quantity: {[Op.gt]: 0}},
        order: [['updated_at', 'DESC']],
      };

      if (req.query.quantity) {
        query['where']['quantity'] = {[Op.gte]: req.query.quantity};
      }
      if (req.query.count) {
        pageLimit = Number.parseInt(req.query.count);
        query['limit'] = pageLimit || null;
      }
      if (req.query.page && req.query.page > 0) {
        query['offset'] = (pageLimit * Number.parseInt(req.query.page)) - pageLimit;
      }
      if (req.query.category) {
        query['include'].push({
          model: Category,
          attributes: ['id', 'name', 'slug', 'description'],
          where: {slug: req.query.category},
        });
      } else {
        query['include'].push({
          model: Category,
          attributes: ['id', 'name', 'slug', 'description'],
        });
      }
      if (req.query.name) {
        query['where']['name'] = {
          [Op.like]: '%' + req.query.name + '%',
        };
      }

      const ret = await Article.findAndCountAll(query);
      res.status(200).json({
        articles: ret.rows,
        totalPages: Math.ceil(ret.count / pageLimit),
      });
    })
    .post(async (req, res) => {
      try {
        const status = await sequelize.transaction(async (t) => {
          const category = await Category.findByPk(req.body.Category.id, {transaction: t});
          const count = await Article.count({
            include: [{model: Category, attributes: [], where: {id: req.body.Category.id}}],
            paranoid: false,
          }, {transaction: t});
          const ret = await Article.create(req.body);

          await ret.setCategory(req.body.Category.id, {transaction: t});
          await ret.update({sku: category.slug.slice(0, 3).toUpperCase() + (count + 1).toString().padStart(5, '0')}, {transaction: t});

          return 200;
        });

        res.status(status).send();
      } catch (err) {
        res.status(500).send();
      }
    });

router.route('/:articleId')
    .get((req, res) => {
      res.status(200).json(req.article);
    })
    .patch(async (req, res) => {
      try {
        const status = await sequelize.transaction(async (t) => {
          await req.article.update(req.body, {transaction: t});
          if (req.body.Category) {
            await req.article.setCategory(req.body.Category.id, {transaction: t});
          }

          return 200;
        });

        res.status(status).send();
      } catch (err) {
        res.status(500).send();
      }
    })
    .delete(async (req, res) => {
      try {
        const status = await sequelize.transaction(async (t) => {
          await req.article.destroy({transaction: t});

          return 200;
        });

        res.status(status).send();
      } catch (err) {
        res.status(500).send();
      }
    });

module.exports = router;
