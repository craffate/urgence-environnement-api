'use strict';

const Order = require('../models/order');

Order.bulkCreate([
  { total: '18.84', status: 'Payé' },
  { total: '24.00', status: 'Impayé' },
  { total: '1234.23', status: 'Payé' },
  { total: '224.01', status: 'Payé' },
  { total: '0.99', status: 'Payé' }
])