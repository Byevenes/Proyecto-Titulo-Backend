const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');

moment.locale('es');

let Schema = mongoose.Schema;

let polygonSchema = new Schema({
  type: {
    type: String,
    default: 'Polygon',
  },
  coordinates: {
    type: [[[Number]]],
    required: true,
  },
});

let recoridoSchema = new Schema({
  poblacion: {
    type: Schema.Types.ObjectId,
    ref: 'Poblacion',
    required: [true, 'La población es necesaria'],
  },
  name_recorrido: {
    type: String,
    required: [true, 'El nombre del recorrido es necesario'],
  },
  descripcion_recorrido: {
    type: String,
    required: [true, 'La descripción del recorrido es necesaria'],
  },
  estado_recorrido: {
    type: Boolean,
    default: true,
  },
  location_recorrido: {
    type: polygonSchema,
    required: [true, 'El poligono de puntos es necesario'],
  },
  date_recorrido_iniciado: {
    type: String,
    default: () => moment().format('dddd, h:mm:ss a'),
  },
  date_recorrido_finalizado: {
    type: String,
    default: () => moment().format('dddd, h:mm:ss a'),
  },
});

module.exports = mongoose.model('Recorrido', recoridoSchema);
