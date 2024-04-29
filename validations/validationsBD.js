const { Categoria, Role, Usuario, Producto } = require('../models');

const validarCorreoExiste = async (correo='') => {
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
        throw new Error(`Este correo ${correo} ya esta registrado en BD`);
    }
}

const validarRolExiste = async (rol='') => {
    const existeRol = await Role.findOne({ rol })
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en BD`)
    }
}

const validarUsuarioExistePorId = async (id='') => {
    const existeID = await Usuario.findById(id);

    if (!existeID) {
      throw new Error(`Este usuario no existe`);
    }
}

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {
      throw new Error(`Esta categoria no existe ${id}`);
    }
}

const existeProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id);

  if (!existeProducto) {
    throw new Error(`Este producto no existe ${id}`);
  }
}

const collectionsPermitidas = (collection = '', collectionsPermitidas = []) => {
  const incluida = collectionsPermitidas.includes(collection)
  if(!incluida) { 
    throw new Error(`La collection ${collection} no es permitida`)
  }

  return true
}

module.exports = {
  validarCorreoExiste,
  validarRolExiste,
  validarUsuarioExistePorId,
  existeCategoriaPorId,
  existeProductoPorId,
  collectionsPermitidas
};