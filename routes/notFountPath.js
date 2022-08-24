const express = require('express');

const notFountPath = express.Router();

notFountPath.all('*', (req, res) => {
  res.send({ message: 'Запрашиваемого ресурса не существует' });
});

module.exports = notFountPath;
