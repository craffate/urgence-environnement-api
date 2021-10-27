'use strict';

const bcrypt = require('bcrypt');
const User = require('../models/user');
const secrets = require('../secrets');

bcrypt.hash('admin', secrets.BCRYPT_SALTROUNDS, (err, hash) => {
  User.create({ username: 'admin', password: hash, role: 1 });
});

bcrypt.hash('user', secrets.BCRYPT_SALTROUNDS, (err, hash) => {
  User.create({ username: 'user', password: hash, role: 0 });
});
