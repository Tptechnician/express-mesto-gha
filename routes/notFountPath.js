const express = require('express');

const notFountPath = express.Router();

notFountPath.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемого ресурса не существует' });
});

module.exports = notFountPath;
