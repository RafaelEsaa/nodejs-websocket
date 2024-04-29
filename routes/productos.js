const { Router } = require("express");
const router = Router();

const validateRequest = require("../middlewares/messageErrors");
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto} = require('../controllers/productos');
const { validarJWT, esAdminRole } = require("../middlewares");
const { validateProductoID, validateCrearProducto } = require("../validations/validateProductos");

router.get('/', obtenerProductos)
router.get("/:id", [validateProductoID(), validateRequest], obtenerProducto);
router.post('/', [validarJWT, validateCrearProducto(), validateRequest], crearProducto)
router.put("/:id", [validarJWT, validateProductoID(), validateRequest], actualizarProducto);
router.delete(
  "/:id",
  [validarJWT, esAdminRole, validateProductoID(), validateRequest],
  eliminarProducto,
);


module.exports = router;