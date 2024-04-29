const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/Usuario");

const { generarJWT } = require("../helpers/generar-jwt");

const { OAuth2Client } = require("google-auth-library");
const { googleVerify } = require("../helpers/google-verify");
const client = new OAuth2Client();

const login = async (req, res = response) => {

    const { correo, password } = req.body
    
    try {
        //Verificar si el email existe
        //Verificar si el usuario esta activo
        const usuario = await Usuario.findOne({ correo, estado: true })
        if (!usuario) {
            return res.status(400).json({ msg: "Datos invalidos" })
        }
        //Verificar la contrasena
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({ msg: "Datos invalidos" })
        }
        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({ usuario, token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req, res = response) => {

    try {
        const { id_token } = req.body;
    
        // devuelve datos de usuario autenticado en google
        const {email, name, picture} = await googleVerify(id_token);
        console.log(email, name, picture);
        
        let usuario = await Usuario.findOne({ correo: email });
    
        if(!usuario) {
            // creamos nuevo usuario
            const data = {
              nombre: name,
              correo: email,
              password: ":P",
              picture,
              rol: "USER_ROLE",
              google: true,
            };
    
            usuario = new Usuario(data)
            await usuario.save();
        }
    
        // si el usuario en BD tiene el estado en false
        if(!usuario.estado) {
            return res.status(401).json({
                msg: "Comuniquese con el administrador, usuario bloqueado"
            })
        }

        //generar json web token
        const token = await generarJWT(usuario.id);
        
        res.json({usuario, token})
    } catch (error) {
        res.status(400).json({
            msg: "Token de google no es válido"
        })
    }
}

const renovarToken = async (req, res) => {
    const usuario = req.usuario;

    //generar json web token
    const token = await generarJWT(usuario.id);
    res.json({ usuario, token })
}

module.exports = {
  login,
  googleSignIn,
  renovarToken,
};