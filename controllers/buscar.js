const { response } = require("express");
const { Usuario, Categoria } = require("../models");
const { ObjectId } = require('mongoose').Types;

const collectionPermitidas = [
    "usuarios",
    "categorias",
    "productos",
    "roles"
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); //true or false

    if(esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, {correo: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); //true or false

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const categorias = await Categoria.find({ nombre: regex, estado: true});

  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); //true or false

  if (esMongoID) {
    const producto = await Producto.findById(termino).populate('categoria', ['nombre']);
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const productos = await Producto.find({
    nombre: regex,
    estado: true,
  }).populate("categoria", ["nombre"]);

  res.json({
    results: productos,
  });
};

const buscar = (req, res = response) => {
    const { collection, termino } = req.params

    if(!collectionPermitidas.includes(collection)) {
        return res.status(400).json({
            msg: `La colecciones permitidas son: ${collectionPermitidas}`
        })
    }

    switch (collection) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        default:
            res.status(500).json({
                msg: "Algo salio mal con esta busqueda"
            })
            break;
    }
}

module.exports = {
    buscar
}