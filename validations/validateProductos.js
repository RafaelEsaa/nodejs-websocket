const { check } = require('express-validator');
const { existeProductoPorId, existeCategoriaPorId } = require("./validationsBD");

const validateCrearProducto = () => {
    return [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("categoria", "No es un ID de Mongo").isMongoId(),
        check("categoria").custom((id) => existeCategoriaPorId(id))
    ]
}

const validateProductoID = () => {
    return [
      check("id", "No es un ID de mongo valido").isMongoId(),
      check("id").custom((id) => existeProductoPorId(id))
    ];
}

module.exports = {
    validateCrearProducto,
    validateProductoID
}