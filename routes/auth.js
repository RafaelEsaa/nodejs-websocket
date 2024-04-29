const { Router } = require("express");

const validateRequest = require("../middlewares/messageErrors");
const { login, googleSignIn, renovarToken } = require("../controllers/auth");
const { validateLogin, validateLoginGoogle } = require("../validations/validateLogin");
const { validarJWT } = require("../middlewares");
const router = Router();

router.get('/', validarJWT, renovarToken)
router.post("/login", [validateLogin(), validateRequest], login);
router.post("/google", [validateLoginGoogle(), validateRequest], googleSignIn);

module.exports = router;