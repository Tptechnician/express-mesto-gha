const Card = require('../models/card');
const { errorServer, errorBadReq, reqNotFound } = require('../errors/errorCodes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(errorServer).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(reqNotFound).send({ message: 'Карточки с таким id нет' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorBadReq).send({ message: 'Передан некорректный id' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadReq).send({ message: 'Некорректные данные карточки' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((updatedCard) => {
      if (!updatedCard) {
        res.status(reqNotFound).send({ message: 'Карточки с таким id нет' });
        return;
      }
      res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorBadReq).send({ message: 'Передан некорректный id' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((updatedCard) => {
      if (!updatedCard) {
        res.status(404).send({ message: 'Карточки с таким id нет' });
        return;
      }
      res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorBadReq).send({ message: 'Передан некорректный id' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
};
