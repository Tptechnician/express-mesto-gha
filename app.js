const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('Проверка еще раз');
});

app.post('/', express.json(), (req, res) => {
  res.send(req.body);
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT, () => {
    console.log(`Сервер запущен на localhost:${PORT}`);
  });
}

main();
