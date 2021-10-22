'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');
const secrets = require('../secrets');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      bcrypt.hash(value, secrets.BCRYPT_SALTROUNDS, (err, hash) => {
        this.setDataValue('password', hash);
      });
    }
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'users',
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = User;