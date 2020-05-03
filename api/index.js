const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const region = require('.//routes/region');
const comuna = require('.//routes/comuna');
const poblacion = require('.//routes/poblacion');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// cors
app.use(cors());

// Configuración global de rutas
//app.use(require('./routes/index'));

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

/**
 * Middleware de las routes requeridas
 */

app.use('/api/region', region);
app.use('/api/comuna', comuna);
app.use('/api/poblacion', poblacion);

module.exports = app;
