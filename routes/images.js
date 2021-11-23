'use strict';

const router = require('express').Router();
const secrets = require('../secrets');
const multer = require('multer');
const upload = multer({dest: secrets.STATIC_FOLDER});
const Image = require('../models/image');

router.param('imageId', async (req, res, next, id) => {
  req.image = await Image.findByPk(id);

  next();
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
      let image;

      for (const file of req.files) {
        image = await Image.build(file);
        image.ArticleId = req.body.articleId;
        await image.save();
      }

      res.status(200).send();
    });

router.route('/:imageId')
    .get((req, res) => {
      res.status(200).json(req.image);
    })
    .patch(async (req, res) => {
      await req.image.update(req.body);

      res.status(200).send();
    })
    .delete(async (req, res) => {
      await req.image.destroy();

      res.status(200).send();
    });

module.exports = router;
