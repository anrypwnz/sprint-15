const router = require('express').Router();
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  createUser, getUser, getUsers, login,
} = require('../controller/users');

router.use(bodyParser.json());

router.get('/users', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), getUsers);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  query: Joi.object().keys({
  }),
}), auth, getUser);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().min(2).uri(),
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required().min(2).max(30),
  }),
}), createUser);
router.post('/signin', login);

module.exports = router;
