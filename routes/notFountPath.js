const express = require('express');
const { reqNotFound } = require('../errors/errorCodes');

const notFountPath = express.Router();

notFountPath.all('*', (req, res) => {
  res.status(reqNotFound).send({ message: 'Запрашиваемого ресурса не существует' });
});

module.exports = notFountPath;
