'use strict';

const secrets = require('./secrets.js');
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
  dialect: secrets.SQL_DIALECT,
  host: secrets.SQL_HOST,
  port: secrets.SQL_PORT,
  username: secrets.SQL_USERNAME,
  password: secrets.SQL_PASSWORD,
  database: secrets.SQL_DB,
});

module.exports = sequelize;
