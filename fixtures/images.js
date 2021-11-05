'use strict';

const Image = require('../models/image');

Image.bulkCreate([
  {filename: 'mob00001_1.jpg', mimetype: 'image/jpeg', path: 'static\\mob00001_1.jpg', ArticleId: 1},
  {filename: 'mob00001_2.jpg', mimetype: 'image/jpeg', path: 'static\\mob00001_2.jpg', ArticleId: 1},
  {filename: 'mob00001_3.jpg', mimetype: 'image/jpeg', path: 'static\\mob00001_3.jpg', ArticleId: 1},
  {filename: 'mob00001_4.jpg', mimetype: 'image/jpeg', path: 'static\\mob00001_4.jpg', ArticleId: 1},
  {filename: 'mob00002_1.jpg', mimetype: 'image/jpeg', path: 'static\\mob00002_1.jpg', ArticleId: 2},
  {filename: 'mob00002_2.jpg', mimetype: 'image/jpeg', path: 'static\\mob00002_2.jpg', ArticleId: 2},
  {filename: 'occ00001_1.jpg', mimetype: 'image/jpeg', path: 'static\\occ00001_1.jpg', ArticleId: 3},
  {filename: 'occ00001_2.jpg', mimetype: 'image/jpeg', path: 'static\\occ00001_2.jpg', ArticleId: 3},
  {filename: 'occ00002_1.jpg', mimetype: 'image/jpeg', path: 'static\\occ00002_1.jpg', ArticleId: 4},
  {filename: 'occ00002_2.jpg', mimetype: 'image/jpeg', path: 'static\\occ00002_2.jpg', ArticleId: 4},
  {filename: 'bri00001_1.jpg', mimetype: 'image/jpeg', path: 'static\\bri00001_1.jpg', ArticleId: 5},
  {filename: 'occ00002_3.png', mimetype: 'image/png', path: 'static\\occ00002_3.png', ArticleId: 4},
  {filename: 'lib00001_1.jpg', mimetype: 'image/jpeg', path: 'static\\lib00001_1.jpg', ArticleId: 6},
  {filename: 'lib00002_1.jpg', mimetype: 'image/jpeg', path: 'static\\lib00002_1.jpg', ArticleId: 7},
]);
