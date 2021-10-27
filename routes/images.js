'use strict';

const router = require('express').Router();
const secrets = require('../secrets');
const multer = require('multer');
const upload = multer({ dest: secrets.STATIC_FOLDER });
const Image = require('../models/image');



router.param('imageId', async (req, res, next, id) => {
  req.image = await Image.findByPk(id);

  next();
});

router.route('/')
.get(async (req, res) => {
  const ret = await Image.findAll();

  res.status(200).json(ret);
})
.post(upload.single("image"), async (req, res) => {
  const ret = await Image.build(req.file);
  ret.ArticleId = req.body.articleId;
  ret.save();

  res.status(200).json(ret);
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