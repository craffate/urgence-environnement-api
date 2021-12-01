'use strict';

const router = require('express').Router();
const Category = require('../models/category');

router.param('categoryId', async (req, res, next, id) => {
  const query = {
    attributes: ['id', 'name', 'slug', 'description'],
  };

  req.category = await Category.findByPk(id, query);

  if (req.category === null) {
    res.status(404).send();
  } else {
    next();
  }
});

router.route('/')
    .get(async (req, res) => {
      const query = {
        attributes: ['id', 'name', 'slug', 'description'],
      };
      const ret = await Category.findAll(query);

      res.status(200).json(ret);
    })
    .post(async (req, res) => {
      const ret = await Category.create(req.body);

      res.status(200).json(ret);
    });

router.route('/:categoryId')
    .get((req, res) => {
      res.status(200).json(req.category);
    })
    .patch(async (req, res) => {
      await req.category.update(req.body);

      res.status(200).send();
    })
    .delete(async (req, res) => {
      await req.category.destroy();

      res.status(200).send();
    });


module.exports = router;
