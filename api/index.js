require('./config/config');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// cors
app.use(cors());

// Configuración global de rutas
app.use(require('./routes'));

// Conección a la base de datos de MONGODB
mongoose.connect(
  process.env.MONGODB_URI_PROYECTO_TITULO,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, res) => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
  }
);

// Conección del puerto de salida
app.listen(process.env.PORT, () => {
  console.log(`escuchando en puerto ${process.env.PORT}`);
});

module.exports = app;
