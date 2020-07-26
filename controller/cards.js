const Card = require('../models/card.js');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.delCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (card == null) {
      res.status(404).send({ message: 'Карточка не найдена' });
    // eslint-disable-next-line eqeqeq
    } else if (req.user._id == card.owner) {
      card.remove().then((deleted) => {
        res.status(200).send({ deleted });
      });
    } else {
      res.status(403).send({ message: 'У вас нет прав на удаление этой карточки' });
    }
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  Card.create({
    name, link, owner: req.user._id, likes: [],
  })
    .then((data) => res.send({ data }))
    .catch((err) => res.status(400).send({ message: err }));
};
