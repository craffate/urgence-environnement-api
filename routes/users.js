'use strict';

const router = require('express').Router();
const bcrypt = require('bcrypt');
const secrets = require('../secrets');
const User = require('../models/user');

router.use(async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, secrets.BCRYPT_SALTROUNDS);
  }
  next();
});

router.param('userId', async (req, res, next, id) => {
  req.user = await User.findByPk(id, {
    attributes: ['id', 'username', 'role'],
  });

  if (req.user === null) {
    res.status(404).send('Not Found');
  } else {
    next();
  }
});

router.route('/')
    .get(async (req, res) => {
      const ret = await User.findAll({
        attributes: ['id', 'username', 'role'],
      });

      res.status(200).json(ret);
    })
    .post(async (req, res) => {
      const [user, built] = await User.findOrBuild({
        where: {username: req.body.username},
      });

      if (built === false) {
        res.status(401).send('Username already in use');
      } else {
        user.password = req.body.password;
        user.role = 0;
        user.save();
      }
      res.status(201).json();
    });

router.route('/:userId')
    .get((req, res) => {
      res.status(200).json(req.user);
    })
    .patch(async (req, res) => {
      await req.user.update(req.body);

      res.status(200).send();
    })
    .delete(async (req, res) => {
      await req.user.destroy();

      res.status(200).send();
    });

module.exports = router;
