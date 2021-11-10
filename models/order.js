'use strict';

const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shipping_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shipping_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Autre',
  },
}, {
  tableName: 'orders',
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = Order;
