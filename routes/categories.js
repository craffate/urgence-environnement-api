'use strict';

const router = require('express').Router();
const Category = require('../models/category');
const sequelize = require('../db');

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
      try {
        const status = await sequelize.transaction(async (t) => {
          await Category.create(req.body, {transaction: t});

          return 200;
        });

        res.status(status).send();
      } catch (err) {
        res.status(500).send();
      }
    });

router.route('/:categoryId')
    .get((req, res) => {
      res.status(200).json(req.category);
    })
    .patch(async (req, res) => {
      try {
        const status = await sequelize.transaction(async (t) => {
          await req.category.update(req.body, {transaction: t});

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
          await req.category.destroy({transaction: t});

          return 200;
        });

        res.status(status).send();
      } catch (err) {
        res.status(500).send();
      }
    });


module.exports = router;
