const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

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
/*
app.use((req, res, next) => {
  req.user = {
    _id: '630264734d9407089bc3ceb6',
  };

  next();
});
*/
app.use('/', require('./routes/users'));
