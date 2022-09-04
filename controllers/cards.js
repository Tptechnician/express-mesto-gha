const Card = require('../models/card');
const ErrorBadReq = require('../errors/errorBadReq');
const ReqNotFound = require('../errors/reqNotFound');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new ReqNotFound('Карточки с таким id нет');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorBadReq('Передан некорректный id');
      }
    })
    .catch(next);
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorBadReq('Некорректные данные карточки');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((updatedCard) => {
      if (!updatedCard) {
        throw new ReqNotFound('Карточки с таким id нет');
      }
      res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorBadReq('Передан некорректный id');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
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
        throw new ErrorBadReq('Передан некорректный id');
      }
    })
    .catch(next);
};
