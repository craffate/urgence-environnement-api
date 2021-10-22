'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'images',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = Image;