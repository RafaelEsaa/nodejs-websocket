const { response } = require('express')
const { Producto } = require('../models')

const obtenerProductos = async (req, res = response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
      const [productos, total] = await Promise.all([
        //El estado true es para mostrar las productos NO BORRADAS
        Producto.find({ estado: true })
          .limit(Number(limit))
          .skip((Number(page) - 1) * limit)
          .populate("usuario", ["nombre"])
          .populate("categoria", ["nombre"]),
        Producto.countDocuments(),
      ]);

      if (!productos) {
        const error = new Error("No hay productos registradas");
        return res.status(404).json({
          msg: error.message,
        });
      }

      res.json({
        productos,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
}

const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate("usuario", [
      "nombre",
    ]).populate("categoria", ["nombre"]);

    res.status(200).json(producto);
}

const crearProducto = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({
      nombre: body.nombre,
    });

    if (productoDB) {
      return res.status(404).json({
        msg: `La categoria ${productoDB.nombre}, ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
    ...body,
      nombre: body.nombre,
      usuario: req.usuario._id,
    };

    const producto = new Producto(data);

    //Guardar en DB
    await producto.save();

    res.status(200).json(producto);
}

const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if(data.nombre) {
        data.nombre = data.nombre;
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {
      new: true,
    });
    return res.json(producto);
}

const eliminarProducto = async (req, res = response) => {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true },
    );
    res.json(productoBorrado);
}

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};