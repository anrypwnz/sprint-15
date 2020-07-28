const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const ConflictErr = require('../errors/conflict-err');
const BadRequestErr = require('../errors/bad-request-err');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user.js');

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  await User.find({ email }).then((data) => {
    try {
      if (data.length !== 0) {
        throw new ConflictErr('Пользователь с таким Email уже существует');
      } else if (!name || !about || !avatar || !password) {
        throw new BadRequestErr('Неподходящие данные');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, about, avatar, email, password: hash,
          }))
          .then((user) => res.send(`Пользователь ${user.name} с почтой ${user.email} успешно зарегистрирован.`))
          .catch((err) => next(err));
      }
    } catch (e) {
      next(e);
    }
  });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotFoundError('Нет пользователя с таким id');
      }
    })
    .catch((err) => next(err));
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    next(e);
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ err: err.message });
    });
};
