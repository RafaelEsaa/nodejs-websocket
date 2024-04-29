const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto} = require("../models")

const cargarArchivo = async (req, res = response) => {

    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files.archivo
    ) {
      res.status(400).json({
        msg: "No files were uploaded.",
      });
      return;
    }

    try {
        // const nombre = await subirArchivo(req.files, ["txt", "md"], 'textos')
        const nombre = await subirArchivo(req.files, undefined, 'imgs')
    
        res.json({
            nombre
        })
    } catch (error) {
        res.status(400).json({msg: error})
    }

}

const actualizarImagen = async (req, res = response) => {
    const { id, collection } = req.params;

    let modelo;

    // Segun la collection que se mando por la url del endpoint actualizo segun modelo
    switch (collection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(404).json({ msg: `No existe un usuario con el ID ${id}` })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
              return res
                .status(404)
                .json({ msg: `No existe un producto con el ID ${id}` });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    const nombre = await subirArchivo(req.files, undefined, 'imgs')
    modelo.img = nombre;
    await modelo.save()

    return res.json(modelo)
}

const mostrarImagen = async (req, res = response) => {
    const { id, collection } = req.params;
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
};