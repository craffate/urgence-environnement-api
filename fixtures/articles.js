'use strict';

const Article = require('../models/article');
const secrets = require('../secrets');

Article.bulkCreate([
  { sku: 'MOB-00001', name: 'Table en marbre', subtitle: 'Sublime', description: 'Très belle table en marbre', price: 499.99 },
  { sku: 'MOB-00002', name: 'Table en plastique', subtitle: 'Pratique', description: 'Pratique et économique', price: 15.00 },
  { sku: 'OCC-00001', name: 'Ordinateur portable', subtitle: 'Puissant', description: 'Petit et puissant. Écran 15"', price: 500.00 },
  { sku: 'OCC-00002', name: 'Xiaomi Mi 10 5G', subtitle: 'Du bon chinois', description: 'Superbre smartphone', price: 199.99 },
  { sku: 'BRI-00001', name: 'Perceuse', description: 'Très pratique', price: 99.99 },
  { sku: 'LIB-00001', name: 'Les Fleurs du mal', subtitle: 'Charles Baudelaire', description: 'Un grand classique', price: 9.99 },
  { sku: 'LIB-00002', name: 'L\'Art de la Guerre', subtitle: 'Sun Tzu', description: 'Un grand classique', price: 9.99 }
])