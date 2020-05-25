// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 365; // token dura 1 año hubo problemas preferi dejar de forma directa

// ============================
//  SEED de autenticación .env
// ============================
process.env.SEEDD = process.env.SEEDD;

// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3001;

// ============================
//  Base de Datos .env
// ============================
process.env.MONGODB_URI_PROYECTO_TITULO =
  process.env.MONGODB_URI_PROYECTO_TITULO;
