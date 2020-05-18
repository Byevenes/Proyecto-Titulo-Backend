const jwt = require('jsonwebtoken');

/**
 * =====================
 *   Verificar Token
 * =====================
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * next = continua con la ejecucion del programa
 * decoded = informacion decodificada
 */

let verificaToken = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, process.env.SEEDD, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no Válido',
        },
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

/**
 * =======================
 *   Verificar admin_role
 * =======================
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

let verificaAdminRole = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es Administrador',
      },
    });
  }
};

/**
 * =====================
 *   Verificar vip_role
 * =====================
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

let verificaChoferRole = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === 'CHOFER_ROLE') {
    next();
  } else {
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es un Chofer',
      },
    });
  }
};

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
};
