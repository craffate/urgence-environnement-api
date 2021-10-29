'use strict';

const sequelize = require(__dirname + '/db');

const Article = require(__dirname + '/models/article');
const Category = require(__dirname + '/models/category');
const Order = require(__dirname + '/models/order');
const Image = require(__dirname + '/models/image');
const User = require(__dirname + '/models/user');

Article.hasMany(Image);
Category.hasMany(Article);
Article.belongsTo(Category);
Order.hasMany(Article);
Order.belongsTo(User);
User.hasMany(Order);

sequelize.sync({
  force: true,
  alter: true
}).then(() => {
  require(__dirname + '/fixtures/articles');
  require(__dirname + '/fixtures/orders');
  require(__dirname + '/fixtures/images');
  require(__dirname + '/fixtures/users');
  process.exitCode = 0;
}).catch((err) => {
  console.error(err);
  process.exitCode = 1;
});