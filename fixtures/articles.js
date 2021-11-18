'use strict';

const Article = require('../models/article');

Article.bulkCreate([
  {sku: 'MOB00001', name: 'Table en marbre', subtitle: 'Sublime', description: 'Très belle table en marbre', price: 499.99, CategoryId: 1},
  {sku: 'MOB00002', name: 'Table en plastique', subtitle: 'Pratique', description: 'Pratique et économique', price: 15.00, quantity: 2, CategoryId: 1},
  {sku: 'OCC00001', name: 'Ordinateur portable', subtitle: 'Puissant', description: 'Petit et puissant. Écran 15"', price: 500.00, CategoryId: 6},
  {sku: 'OCC00002', name: 'Xiaomi Mi 10 5G', subtitle: 'Du bon chinois', description: 'Superbre smartphone', price: 199.99, CategoryId: 6},
  {sku: 'BRI00001', name: 'Perceuse', subtitle: 'Metabo', description: 'Très pratique', price: 99.99, CategoryId: 4},
  {sku: 'LIB00001', name: 'Les Fleurs du mal', subtitle: 'Charles Baudelaire', description: 'Un grand classique', price: 9.99, CategoryId: 2},
  {sku: 'LIB00002', name: 'L\'Art de la Guerre', subtitle: 'Sun Tzu', description: 'Un grand classique', price: 9.99, CategoryId: 2},
  {sku: 'BRO00001', name: 'Armoire Napoléon III', subtitle: 'Armoire d\'Apparat Napoléon III', description: 'Exceptionnelle armoire d\'apparat de style et d\'époque Napoléon III à façade galbée ouvrant deux vantaux présentant des médaillons en marquèterie florale sur fond d\'ébène. Partie supérieure deforme doucine marquétée, beau piètement galbé à décor de fleurettes.\nIntérieur en placage de palissandre de rio sur un bâti en chêne.\nTravail parisien de très belle qualité.\nTrès bon état - entièrement restauré par notre atelier - finition vernis au tampon', price: 5000.00, CategoryId: 5},
  {sku: 'LOI00001', name: 'Jeu d\'échecs', subtitle: 'Jeu en bois', description: 'Jeu d\'échecs pliable Pour l\'emmener partout, en voiture, en voyage, à la mer ou la montagne.\n\nEn bois, fabriqué en Allemagne', price: 19.99, CategoryId: 3},
  {sku: 'MOB00003', name: 'Canapé LOFT', subtitle: '3 places', description: 'Confort imposant et moelleux extrême mis en avant par son revêtement coloris blanc, lignes épurées et intemporelles… Le canapé fixe style cocooning 3 places LOFT a de quoi retenir votre attention. Parfait dans un salon à l’esprit design et chaleureux, il sera la pièce maîtresse de votre déco grâce à sa teinte tendance. Canapé confortable pour les moments de repos, il se transforme en un véritable canapé convivial pour vos soirées avec les amis. Confortable et stylé : ce canapé 3 places a tout bon, n\'est-ce pas ?', price: 2200.00, CategoryId: 1},
  {sku: 'DIV00001', name: 'Trousse Paris', subtitle: 'Cuir véritable', description: 'La trousse en cuir PARIS a la taille parfaite pour glisser vos stylos favoris.', price: 25.00, length: 12.33, width: 5.60, dimensions_unit: 'cm', CategoryId: 7},
]);
