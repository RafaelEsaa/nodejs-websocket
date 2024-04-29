const { verifyJWT } = require("../helpers/validarJWT")
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes();

const socketController = async (socket, io) => {
    //this.io mensaje para todos
    //socket solo a la persona conectada
    // console.log('Cliente conectado', socket.id)
    const usuario = await verifyJWT(socket.handshake.headers['x-token'])
    // console.log(usuario)
    if(!usuario) {
        return socket.disconnect();
    }
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)

    //Conecta al usuario a una sala especial (para que sea unica y podamos enviar mensaje directo a un usuario)
    socket.join(usuario.id)
    
    //Agregar al usuario conectado
    chatMensajes.conectarUsuario(usuario)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    
    //Limpiar cuando alguien se desconecta, cierra pestana o se va a otra url
    socket.on("disconnect", () => {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit("usuarios-activos", chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({mensaje, uid}) => {
        console.log('mensaje', mensaje, uid)
        if(uid) {
            // Mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje})
        } else {
            chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje);
            io.emit("recibir-mensajes", chatMensajes.ultimos10);
        }
    })
}

module.exports = {
    socketController
}