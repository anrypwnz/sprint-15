const router = require('express').Router();
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');
const { createCard, getCard, delCard } = require('../controller/cards');

router.use(bodyParser.json());
router.get('/cards', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, getCard);
router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  query: Joi.object().keys({
  }),
}), auth, delCard);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).custom((value) => {
      if (!validator.isURL(value)) {
        throw new Error('incorrect URL');
      }
      return value;
    }),
  }),
}), auth, createCard);

module.exports = router;
