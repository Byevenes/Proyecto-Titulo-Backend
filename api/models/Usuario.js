const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

/**
 * rolesValidos es una variable que almacena un array de valores
 * que pueden tomar los diferentes tipos de usuarios.
 *
 * Para que despues en la aplicación se pueda administrar a los usuarios
 * y que mostrarle segun el tipo de usuario son
 */

let rolesValidos = {
  values: ['ADMIN_ROLE', 'VIP_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido',
};

/**
 * Modelo del usuario utilizando mongoose para crear el modelo
 * uniqueValidator para dejar como unico el email del usuario
 *
 * En este modelo se piden varias cosas
 * 1.- el nombre para poder generar un perfil con este nombre
 * 2.- el email unico para poder diferencia a los usuarios en los comentarios de recorridos
 * 3.- la password que sera encriptada para poder loguearse o registrarse de manera obligatoria
 * 4.- el role el cual explicamos anteriormente como funciona y dejamos por defaul que seran del tipo 'USER_ROLE'
 * 5.- el estado que por default sera un boolean true, para poder tener consistencia para eliminar un usuario solo se cambie el estado y no sea posible
 *     ser visualizado, pero que en al base de datos existira aún.
 */

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El email es necesario'],
  },
  password: {
    type: String,
    required: [true, 'La password es necesaria'],
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

/**
 * Metodo creado para cuando nos loguiamos o creamos una cuenta no se vea dentro de los console log la contraseña enviada,
 * pero que si se estara enviando solo que no sera visible
 */

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);
