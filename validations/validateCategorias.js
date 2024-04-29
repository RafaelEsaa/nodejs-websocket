const { check } = require("express-validator");
const { existeCategoriaPorId } = require("./validationsBD");

const validateCrearCategoria = () => {
    return [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ]
}

const validateCategoriaID = () => {
    return [
      check("id", "No es un ID de mongo valido").isMongoId(),
      check("id").custom((id) => existeCategoriaPorId(id)),
    ];
}

const validateActualizarCategoriaPorID = () => {
    return [
      check("nombre", "El nombre es obligatorio").notEmpty(),
      check("id").custom((id) => existeCategoriaPorId(id)),
    ];
}

module.exports = {
  validateCrearCategoria,
  validateCategoriaID,
  validateActualizarCategoriaPorID
};