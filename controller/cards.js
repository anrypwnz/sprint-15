const Card = require('../models/card.js');
const NotFoundError = require('../errors/not-found-err');
const NoRightsErr = require('../errors/no-rights-err');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch((err) => next(err));
};

module.exports.delCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (card == null) {
      throw new NotFoundError('Карточка не найдена');
    // eslint-disable-next-line eqeqeq
    } else if (req.user._id == card.owner) {
      card.remove().then((deleted) => {
        res.status(200).send({ deleted });
      });
    } else {
      throw new NoRightsErr('У вас нет прав на удаление этой карточки');
    }
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const {
    name, link,
  } = req.body;
  const createdCard = await Card.create({
    name, link, owner: req.user._id, likes: [],
  });
  if (createdCard) {
    try {
      res.send({ createdCard });
    } catch (err) {
      next(err);
    }
  } else {
    throw new NoRightsErr('Невозможно создать карточку');
  }
};
