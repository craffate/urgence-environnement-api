'use strict';

const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    defaultValue: 1,
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: true,
  },
  weight_unit: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'g',
  },
  length: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: true,
  },
  width: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: true,
  },
  height: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: true,
  },
  dimensions_unit: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'mm',
  },
}, {
  paranoid: true,
  tableName: 'articles',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = Article;
