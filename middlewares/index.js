const validateRequest = require("./messageErrors");
const validarJWT = require("./validar-jwt");
const validarRoles = require("./validar-roles");

module.exports = {
    validateRequest,
    ...validarJWT,
    ...validarRoles,
}
