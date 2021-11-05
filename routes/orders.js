'use strict';

const router = require('express').Router();
const Order = require('../models/order');

router.param('orderId', async (req, res, next, id) => {
  req.order = await Order.findByPk(id);

  next();
});

router.route('/')
    .get(async (req, res) => {
      const ret = await Order.findAll();

      res.status(200).json(ret);
    })
    .post(async (req, res) => {
      const ret = await Order.create(req.body);

      res.status(200).json(ret);
    });

router.route('/:orderId')
    .get((req, res) => {
      res.status(200).json(req.order);
    })
    .patch(async (req, res) => {
      await req.order.update(req.body);

      res.status(200).send();
    })
    .delete(async (req, res) => {
      await req.order.destroy();

      res.status(200).send();
    });

module.exports = router;
