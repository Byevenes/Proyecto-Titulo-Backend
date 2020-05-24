// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
//process.env.CADUCIDAD_TOKEN = '48h'; // token dura 1 año hubo problemas preferi dejar de forma directa

// ============================
//  SEED de autenticación
// ============================
process.env.SEEDD = process.env.SEEDD || 'seed-de-desarrollo';

// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3001;

// ============================
//  Base de datos
// ============================
process.env.MONGODB_URI_PROYECTO_TITULO =
  'mongodb+srv://proyecto-titulo-master:lmVsQNqxETopHeEy@proyecto-titulo-db-knppy.mongodb.net/test?retryWrites=true&w=majority';
