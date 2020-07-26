const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user.js');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.find({ email }).then((data) => {
    if (data.length !== 0) {
      res.status(409).send({ message: 'Пользователь с таким Email уже существует' });
    } else if (!name || !about || !avatar || !password) {
      res.status(400).send({ message: 'Неподходящие данные' });
    } else {
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((user) => res.send(`Пользователь ${user.name} с почтой ${user.email} успешно зарегистрирован.`))
        .catch((e) => res.status(400).send(e));
    }
  });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user != null) {
        res.send({ user });
      } else {
        res.status(404).send({ message: 'Нет такого пользователя' });
      }
    })
    .catch((err) => res.status(400).send({ err, message: 'Произошла ошибка' }));
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
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
