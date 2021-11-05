'use strict';

const Category = require('../models/category');

Category.bulkCreate([
  {name: 'Mobilier', slug: 'mobilier', description: null},
  {name: 'Librairie', slug: 'librairie', description: null},
  {name: 'Loisir', slug: 'loisir', description: null},
  {name: 'Bricolage', slug: 'bricolage', description: null},
  {name: 'Brocante', slug: 'brocante', description: null},
  {name: 'Objets d\'occasion', slug: 'occasion', description: null},
  {name: 'Divers', slug: 'divers', description: null},
]);
