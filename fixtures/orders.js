'use strict';

const Order = require('../models/order');

const jdupont = {
  name: 'Jean Dupont',
  address: '11 Rue de Rivoli 75004 Paris',
  email: 'jean.dupont@orange.fr',
  phone: '06 01 02 03 04',
};

Order.bulkCreate([
  {total: '99.99', status: 'COMPLETED', shipping_name: jdupont.name, shipping_address: jdupont.address, method: 'PayPal'},
  {total: '10.00', status: 'COMPLETED', shipping_name: jdupont.name, shipping_address: jdupont.address, method: 'Autre'},
  {total: '23.11', status: 'COMPLETED', shipping_name: jdupont.name, shipping_address: jdupont.address},
]).then((res) => {
  res.forEach((order) => {
    order.createPayer(jdupont);
  });
});
