const { check } = require("express-validator");

const validateLogin = () => {
    return [
        check("correo").not().isEmpty().withMessage("El correo es requerido").isEmail().withMessage('No es un correo valido'),
        check("password").not().isEmpty().withMessage("La contraseña es obligatoria")
    ]
}

const validateLoginGoogle = () => {
    return [
      check("id_token", "token de google es necesario").not().isEmpty()
    ];
}

module.exports = {
    validateLogin,
    validateLoginGoogle
}