'use strict';

const router = require('express').Router();
const secrets = require('../secrets');
const multer = require('multer');
const upload = multer({dest: secrets.STATIC_FOLDER});
const Image = require('../models/image');
const sequelize = require('../db');

router.param('imageId', async (req, res, next, id) => {
  req.image = await Image.findByPk(id);

  if (req.image === null) {
    res.status(404).send();
  } else {
    next();
  }
});

router.route('/')
    .get(async (req, res) => {
      let ret;

      if (req.query.articleId) {
        ret = await Image.findAll({where: {ArticleId: req.query.articleId}});
      } else {
        ret = await Image.findAll();
      }
      if (req.query.count) {
        ret = ret.slice(0, req.query.count);
      }

      res.status(200).json(ret);
    })
    .post(upload.array('images'), async (req, res) => {
      try {
        const status = await sequelize.transaction(async (t) => {
          let image;

          for (const file of req.files) {
            image = await Image.build(file, {transaction: t});
            image.ArticleId = req.body.articleId;
            await image.save({transaction: t});
          }

          return 200;
        });

        res.status(status).send();
      } catch (err) {
        res.status(500).send();
      }
    });

router.route('/:imageId')
    .get((req, res) => {
      res.status(200).json(req.image);
    })
    .patch(async (req, res) => {
      try {
        const status = await sequelize.transaction(async (t) => {
          await req.image.update(req.body, {transaction: t});

          return 200;
        });

        res.status(status).send();
      } catch (err) {
        res.status(500).send();
      }
    })
    .delete(async (req, res) => {
      try {
        const status = await sequelize.transaction(async (t) => {
          await req.image.destroy({transaction: t});

          return 200;
        });

        res.status(status).send();
      } catch (err) {
        res.status(500).send();
      }
    });

module.exports = router;
