const { response } = require("express");
const { Categoria } = require('../models')

const obtenerCategorias = async (req, res) => {
    const {page = 1, limit = 10} = req.query;

    try {
        const [categorias, total] = await Promise.all([
          //El estado true es para mostrar las categorias NO BORRADAS
          Categoria.find({ estado: true })
            .limit(Number(limit))
            .skip((Number(page) - 1) * limit)
            .populate('usuario', ['nombre']),
          Categoria.countDocuments(),
        ]);

        if (!categorias) {
          const error = new Error("No hay categorias registradas");
          return res.status(404).json({
            msg: error.message,
          });
        }

        res.json({
          categorias,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message,
        });
    }
}

const obtenerCategoria = async (req, res) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', ['nombre']);

    res.status(200).json(categoria)
}

const crearCategoria = async (req, res = response) => {
    const { nombre } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: nombre.toUpperCase() });

    if(categoriaDB) {
        return res.status(404).json({
            msg: `La categoria ${nombre}, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();

    res.status(200).json(categoria)
}

const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body
    data.nombre = data.nombre.toUpperCase();

    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })
    return res.json(categoria)
}

const eliminarCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json(categoriaBorrada)
}

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
};