const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario")

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header("x-token");

    if(!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }

    try {
        const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(payload.uid);

        if(!usuario) {
            res.status(401).json({
                msg: "Token no válido"
            })
        }

        //Verificar si el usuario no esta eliminado
        if(!usuario.estado) {
            return res.status(401).json({
                msg: "Token no válido"
            })
        }

        req.usuario = usuario
        next()
    } catch (error) {
        res.status(401).json({
            msg: "Token no válido"
        })
    }
}

module.exports = {
    validarJWT
}