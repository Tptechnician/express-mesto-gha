const express = require('express');

const cardsRouter = express.Router();
const { getCards, createCards, deleteCard } = require('../controllers/cards');

cardsRouter.get('/cards', getCards);

cardsRouter.post('/cards', express.json(), createCards);

cardsRouter.delete('/cards/:cardId', deleteCard);

module.exports = cardsRouter;
