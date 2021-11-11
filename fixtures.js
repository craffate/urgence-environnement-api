'use strict';

const sequelize = require(__dirname + '/db');

require(__dirname + '/models/user');
const Article = require(__dirname + '/models/article');
const Category = require(__dirname + '/models/category');
const Image = require(__dirname + '/models/image');

Article.hasMany(Image);
Image.belongsTo(Article);
Category.hasMany(Article);
Article.belongsTo(Category);

sequelize.sync({
  force: true,
  alter: true,
}).then(() => {
  require(__dirname + '/fixtures/categories');
  require(__dirname + '/fixtures/articles');
  require(__dirname + '/fixtures/images');
  require(__dirname + '/fixtures/users');
  process.exitCode = 0;
}).catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
