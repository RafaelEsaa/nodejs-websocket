const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/Usuario');

const usuariosGet = async (req, res = response) => {
    const {page = 1, limit = 10} = req.query;

    try {

        //El Promise.all nos permite ejecutar 2 o mas promesas en simultaneo, y la funcion
        //no termina hasta que todas las promesas internas no se hayan ejecutado. Se hace
        //de esta manera porque una promise no depende estrictamente de la otra en datos para
        //que se ejecute
        const [usuarios, total] = await Promise.all([
          //El estado true es para mostrar los usuarios NO BORRADOS
          Usuario.find({ estado: true })
            .limit(Number(limit))
            .skip((Number(page) - 1) * limit),
          Usuario.countDocuments(),
        ]);

        if (!usuarios) {
          const error = new Error("No hay usuarios registrados");
          return res.status(404).json({
            msg: error.message,
          });
        }

        res.json({
          usuarios,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        });
    } catch (error) {
        console.log(error);
    }

}

const usuariosPost = async (req, res = response) => {
    const {nombre, correo, password, rol} = req.body;

    const usuario = new Usuario({
        nombre, correo, password, rol
    });

    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.json(usuario)
}

const usuariosPut = async (req, res = response) => {
    const {id} = req.params
    const {_id, password, google, correo, ...resto} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        usuario
    })
}

const usuariosDelete = async (req, res = response) => {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    const usuarioAutenticado = req.usuario;
    res.json({usuario, usuarioAutenticado})
}

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "usuariosPatch api-controller",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuariosPatch,
};