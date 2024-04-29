const { check } = require("express-validator");
const { collectionsPermitidas } = require("./validationsBD");

const validateActualizarArchivo = () => {
    return [
        check('id', "El id debe ser de mongo").isMongoId(),
        check('collection').custom(collection => collectionsPermitidas(collection, ['usuarios', 'productos']))
    ]
}

module.exports = {
    validateActualizarArchivo
}