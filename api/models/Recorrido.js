const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//const moment = require('moment');
const moment = require('moment-timezone');

moment.locale('es');

let Schema = mongoose.Schema;

/**
 * Modelo del poligono de puntos para la utilización del modelo del recorridoSchema
 *
 * En este modelo se piden 2 cosas
 * 1.- Un valor por default Polygon para señalar de que tipo de String es.
 * 2.- la coordinates que sera un triple array de numeros para tener un conjunto de puntos.
 */

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

/**
 * Modelo del punto para la utilización del modelo del recorridoSchema.
 *
 * En este modelo se piden 2 cosas
 * 1.- Un valor por default Point para señalar de que tipo de String es.
 * 2.- la coordinates que sera un array de numero que sera necesario.
 */

let pointSchema = new Schema({
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

/**
 * Modelo recorridoSchema para la utilización de marcacar un polygono de puntos con respecto al recorrido
 *
 * En este modelo se pieden 7 cosas
 * 1.- La población que estara asociado el recorrido la cual es necesaria.
 * 2.- El nombre que tendra el recorrido tambien es requerido.
 * 3.- La descripción del recorrido de igual manera requerido.
 * 4.- El estado del recorrido que por default sera true, si este se encuentra operativo o no.
 * 5.- La localización de los puntos del polygono que sera requeridos.
 * 6.- La locaclización del punto de entrada que puede ser 1 o mas de una entrada al recorrido
 * 7.- La locaclización del punto de salida que puede ser 1 o mas de una salida al recorrido
 * 8.- La fecha de inicio del recorrido que sera necesaria.
 * 9.- La fecha de termino del recorrido que tambien sera obligatoria.
 */

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
  location_recorrido_punto_entrada: {
    type: pointSchema,
    required: [true, 'El punto de entrada es necesario'],
  },
  location_recorrido_punto_salida: {
    type: pointSchema,
    required: [true, 'El punto de salida es necesario'],
  },
  date_recorrido_iniciado: {
    type: String,
    default: () => moment().tz('America/Santiago').format('dddd, h:mm:ss a'),
    required: [true, 'El horario de inicio es necesario'],
  },
  date_recorrido_finalizado: {
    type: String,
    default: () => moment().tz('America/Santiago').format('dddd, h:mm:ss a'),
    required: [true, 'El horario de termino es necesario'],
  },
});

module.exports = mongoose.model('Recorrido', recoridoSchema);
