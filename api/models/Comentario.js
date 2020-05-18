const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');

let Schema = mongoose.Schema;

/**
 * Modelo de caja de comentarios utilizando mongoose para crear el modelo,
 *
 * En este modelo se piden 2 cosas
 * 1.- La descripción del comentario que sera requerida
 * 2.- el id del modelo de Usuario para poder tener una referencia con el email
 *     de quien es el creador del comentario con respecto a el recorrido, tambien es requerido.
 */

let comentarioSchema = new Schema({
  description_comentario: {
    type: String,
    required: [true, 'La descripción es necesaria'],
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El creador del comentario es necesario'],
  },
  date_comentario: {
    type: String,
    default: () => moment().format('DD-MM-YYYY, h:mm:ss a'),
  },
});

module.exports = mongoose.model('Comentario', comentarioSchema);
