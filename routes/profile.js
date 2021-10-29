'use strict';

const router = require('express').Router();
const User = require('../models/user');

router.use(async (req, res, next) => {
  if (req.session) {
    req.user = await User.findByPk(req.session.user.id);
    next();
  } else {
    res.status(401).send();
  }
});


router.route('/')
.get(async (req, res) => {
  const ret = req.user;

  res.status(200).json(ret);
})

router.route('/orders')
.get(async (req, res) => {
  const ret = await req.user.getOrders();

  res.status(200).json(ret);
})

module.exports = router;