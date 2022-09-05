const express = require('express');
const { celebrate, Joi } = require('celebrate');

const cardsRouter = express.Router();
const {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);

cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
  }),
}), createCards);

cardsRouter.delete('/cards/:cardId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCard);

cardsRouter.put('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

cardsRouter.delete('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardsRouter;
