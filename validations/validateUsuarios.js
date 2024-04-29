const { check } = require("express-validator");

const {
  validarCorreoExiste,
  validarRolExiste,
  validarUsuarioExistePorId,
} = require("./validationsBD");

const validateCrearUsuario = () => {
    return [
      check("nombre", "El nombre es obligatorio").not().isEmpty(),
      check("correo", "El correo no es valido").isEmail(),
      check("correo").custom((correo) => validarCorreoExiste(correo)),
      check(
        "password",
        "El password es obligatorio y mas de 6 caracteres",
      ).isLength({ min: 6 }),
      check("rol").custom((rol) => validarRolExiste(rol)),
    ];
}

const validateActualizarUsuario = () => {
    return [
      check("id", "No es un id valido").isMongoId(),
      check("id").custom((id) => validarUsuarioExistePorId(id)),
      check("rol").custom((rol) => validarRolExiste(rol))
    ];
}

const validarEliminarUsuario = () => {
    return [
      check("id", "No es un id valido").isMongoId(),
      check("id").custom((id) => validarUsuarioExistePorId(id)),
    ];
}

module.exports = {
  validateCrearUsuario,
  validateActualizarUsuario,
  validarEliminarUsuario,
};