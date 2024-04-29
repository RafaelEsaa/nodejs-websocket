const { response } = require("express")

const esAdminRole = (req, res, next) => {
    if(!req.usuario) {
        return res.status(500).json({
            msg: "Se quiere validar el rol sin verificar el token"
        })
    }

    const { rol, nombre } = req.usuario;

    if(rol !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${nombre} no tiene el rol de Administrador`
        })
    }
}

const tieneRol = (...roles) => {

    return (req, res, next) => {
        if (!req.usuario) {
          return res.status(500).json({
            msg: "Primero se debe verificar el token",
          });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio require un rol que no posees ${roles}`
            })
        }
        next()
    }
}

module.exports = { esAdminRole, tieneRol }