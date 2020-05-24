require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const comentario = require('./routes/comentario');
const comuna = require('./routes/comuna');
const login = require('./routes/login');
const poblacion = require('./routes/poblacion');
const puntoChofer = require('./routes/puntoChofer');
const recorrido = require('./routes/recorrido');
const region = require('./routes/region');
const usuario = require('./routes/usuario');

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

app.listen(process.env.PORT, () => {
  console.log(`escuachando en puerto ${process.env.PORT}`);
});

/**
 * Middleware de las routes requeridas
 */

app.use('/api/comentario', comentario);
app.use('/api/comuna', comuna);
app.use('/api/login', login);
app.use('/api/poblacion', poblacion);
app.use('/api/puntochofer', puntoChofer);
app.use('/api/recorrido', recorrido);
app.use('/api/region', region);
app.use('/api/usuario', usuario);

module.exports = app;
