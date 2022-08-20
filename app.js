const { application } = require("express");
const express = require("express");

const { PORT = 3000 } = process.env;

const app = express();

app.get("/", (req, res) =>{
  res.send("Проверка")
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});