'use strict';

const router = require('express').Router();
const Payer = require('../models/payer');
const Order = require('../models/order');

router.param('orderId', async (req, res, next, id) => {
  req.order = await Order.findByPk(id, {include: Payer});

  next();
});

router.route('/')
    .get(async (req, res) => {
      const ret = await Order.findAll({include: Payer});

      res.status(200).json(ret);
    })
    .post(async (req, res) => {
      const ret = await Order.create(req.body);
      req.body.Payer.phone = await JSON.parse(req.body.Payer.phone).phone_number.national_number;
      await ret.createPayer(req.body.Payer);
      await ret.save();

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
