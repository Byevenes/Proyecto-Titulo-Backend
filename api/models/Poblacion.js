const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

/**
 * Modelo de la población utilizando libreria mongoose para poder crear el modelo
 * uniqueValidator para dejar como unico los nombres de poblacion al crearse,
 * por ejemplo no podrian haber 2 poblaciones llamadas talcahuano.
 *
 * En este modelo se piden 2 cosas
 * 1.- el nombre de la poblacion el cual es unico y tambien requerido
 * 2.- el id del modelo de colección comuna para poder asociarlos que tambien es requerida
 *
 * Quitar los comentarios de unique cuando esten ya creadas las regiones correspondientes
 * dato que al ser unica no se pueden editar estos datos despues ya que es la misma id.
 */

let poblacionSchema = new Schema({
  name_poblacion: {
    type: String,
    //unique: true,
    required: [true, 'El nombre es necesario'],
  },
  comuna: {
    type: Schema.Types.ObjectId,
    ref: 'Comuna',
    required: [true, 'La comuna es necesaria'],
  },
});

//poblacionSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Poblacion', poblacionSchema);
