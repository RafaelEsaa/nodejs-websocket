const jwt = require("jsonwebtoken");
const { Usuario } = require('../models')

const verifyJWT = async (token) => {
    if(!token) return null;

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid)

        if(usuario) {
            if(usuario.estado){
                return usuario
            } else {
                return null
            }
        }
        return null
    } catch (error) {
        return null
    }
}

module.exports = {
    verifyJWT
}