'use strict';

const Article = require('../models/article');
const Order = require('../models/order');

const jdupont = {
  name: 'Jean Dupont',
  address: '11 Rue de Rivoli 75004 Paris',
  email: 'jean.dupont@orange.fr',
  phone: '06 01 02 03 04',
};

Order.bulkCreate([
  {total: '9.99', status: 'COMPLETED', shipping_name: jdupont.name, shipping_address: jdupont.address, method: 'PayPal'},
]).then((res) => {
  res.forEach(async (order) => {
    const article = await Article.findOne({where: {price: '9.99'}});
    await order.createPayer(jdupont);
    await order.setArticles([article]);
  });
});
