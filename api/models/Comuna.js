const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

/**
 * Modelo de la comuna utilizando mongoose para la creación del modelo
 * uniqueValidator para dejar unico los nombres de las comunas,
 * por ejemplo no podrian haber mas de 1 comuna llamada lomas coloradas.
 *
 * En este modelo se piden 2 cosas
 * 1.- el nombre de la comuna el cual es unico y tambien requerido
 * 2.- el id del modelo de la colección región para asociarlas y tambien es requerida
 *
 * Quitar los comentarios de unique cuando esten ya creadas las regiones correspondientes
 * dato que al ser unica no se pueden editar estos datos despues ya que es la misma id.
 */

let comunaSchema = new Schema({
  name_comuna: {
    type: String,
    //unique: true,
    required: [true, 'El nombre es necesario'],
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region',
    required: [true, 'La region es necesaria'],
  },
});

//comunaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Comuna', comunaSchema);
