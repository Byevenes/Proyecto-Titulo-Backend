const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');

let Schema = mongoose.Schema;

/**
 * Modelo del punto para la utilización del modelo del puntoChoferSchema.
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
 * Modelo puntoChoferSchema para la utilización de marcar el punto de dejada de basura
 * en el punto del vertedero.
 *
 * En este modelo se piden 3 cosas
 * 1.- El chofer, para identificar que persona deja la basura en el vertedero
 * 2.- la fecha que no es necesaria ingresar dado que por default se creara al crear el punto
 * 3.- location sera el punto de cordenadas de latitude y longitud de donde se deja la basura
 */

let puntoChoferSchema = new Schema({
  chofer: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El chofer es necesario'],
  },
  date_chofer: {
    type: String,
    default: () => moment().format('DD-MM-YYYY, h:mm:ss a'),
  },
  location: {
    type: pointSchema,
    required: [true, 'El punto del chofer es necesario'],
  },
});

module.exports = mongoose.model('PuntoChofer', puntoChoferSchema);
