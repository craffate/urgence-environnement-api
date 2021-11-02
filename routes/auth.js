'use strict';

const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.route("/")
.get(async (req, res) => {
  if (req.session.user.role === 1) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

router.route("/login")
.post(async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        'username': req.body.username
      }
    });
    const match = await bcrypt.compare(req.body.password, user.password);
  
    if (match) {
      req.session.user = { 'id': user.id, 'username': user.username, 'role': user.role };
      res.status(200).send('OK');
    } else {
      res.status(401).send();
    }
  } catch (err) {
    if (err instanceof TypeError) {
      res.status(401).send();
    }
    res.status(500).send();
  }
});

router.route("/logout")
.post(async (req, res) => {
  req.session.destroy();
  
  res.clearCookie('sid');
  res.status(200).send();
});

module.exports = router;