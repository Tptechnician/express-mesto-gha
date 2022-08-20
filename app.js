const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('Проверка еще раз');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на localhost:${PORT}`);
});
