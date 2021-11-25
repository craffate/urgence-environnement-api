'use strict';

const router = require('express').Router();
const Op = require('sequelize').Op;
const Article = require('../models/article');
const Category = require('../models/category');
const Image = require('../models/image');

router.param('articleId', async (req, res, next, id) => {
  const query = {
    attributes: ['id', 'sku', 'name', 'subtitle', 'description', 'price', 'quantity',
      'weight', 'weight_unit',
      'length', 'width', 'height', 'dimensions_unit', 'updated_at'],
    include: [{model: Image, attributes: ['id', 'filename', 'mimetype', 'path']}],
  };

  req.article = await Article.findByPk(id, query);

  next();
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
        query['where']['quantity'] = {[Op.gt]: req.query.quantity};
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
      const category = await Category.findByPk(req.body.Category.id);
      const count = await Article.count({
        include: [{model: Category, attributes: [], where: {id: req.body.Category.id}}],
        paranoid: false,
      });
      const ret = await Article.create(req.body);

      await ret.setCategory(req.body.Category.id);
      await ret.update({sku: category.slug.slice(0, 3).toUpperCase() + (count + 1).toString().padStart(5, '0')});

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
