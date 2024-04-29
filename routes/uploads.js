const { Router } = require('express');
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
} = require("../controllers/uploads");
const { validateRequest } = require("../middlewares");
const { validateActualizarArchivo } = require('../validations/validateUploads');

const router = Router();

router.post('/', cargarArchivo);
router.put(
  "/:collection/:id",
  [validateActualizarArchivo(), validateRequest],
  actualizarImagen,
);
router.get(
  "/:collection/:id",
  [validateActualizarArchivo(), validateRequest],
  mostrarImagen,
);

module.exports = router;