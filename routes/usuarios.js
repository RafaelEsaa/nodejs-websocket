const { Router } = require('express');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

// const validateRequest = require("../middlewares/messageErrors");
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { tieneRol } = require("../middlewares/validar-roles");

const { validarJWT, tieneRol, validateRequest } = require("../middlewares");

const {
  validateCrearUsuario,
  validateActualizarUsuario,
  validarEliminarUsuario,
} = require("../validations/validateUsuarios");
const router = Router();

router.get("/", usuariosGet);

router.post("/", [validateCrearUsuario(), validateRequest], usuariosPost);

router.put("/:id", [validateActualizarUsuario(), validateRequest], usuariosPut);

router.delete("/:id",
  [
    validarJWT,
    //Puede enviar varios roles para validar
    tieneRol("ADMIN_ROLE"),
    validarEliminarUsuario(), 
    validateRequest
  ], 
  usuariosDelete);

router.patch("/", usuariosPatch);

module.exports = router