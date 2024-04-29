const { Router } = require("express");

const validateRequest = require("../middlewares/messageErrors");
const { validateCrearCategoria, validateCategoriaID, validateActualizarCategoriaPorID } = require("../validations/validateCategorias");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require("../controllers/categorias");
const { validarJWT, esAdminRole } = require("../middlewares");
const router = Router();

// Obtener todas las categorias
router.get("/", obtenerCategorias);

// Obtener una categoria por :id
router.get("/:id", [validateCategoriaID(), validateRequest], obtenerCategoria);

// Crear categoria - privado para cualquier persona con un token valido
router.post("/", [validarJWT, validateCrearCategoria(), validateRequest], crearCategoria);

// Actualizar un registro por :id - privado para cualquier persona
router.put(
  "/:id",
  [validarJWT, validateActualizarCategoriaPorID(), validateRequest],
  actualizarCategoria,
);

// Borrar una categoria :id - privado solo para admin
router.delete(
  "/:id",
  [validarJWT, esAdminRole, validateCategoriaID(), validateRequest],
  eliminarCategoria,
);

module.exports = router;
