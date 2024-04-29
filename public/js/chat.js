//Referencias
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

let usuario = null;
let socket = null;

const url = "http://localhost:8080/api/auth/";

//Validar el token del localStorage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token')
    }

    const resp = await fetch(url, {
        headers: {
            'x-token': token
        }
    })

    const { usuario: userDB, token: tokenDB } = await resp.json();
    console.log(userDB, tokenDB)
    localStorage.setItem('token', tokenDB)
    usuario = userDB

    document.title = usuario.nombre;
    await conectarSocket();
}

const conectarSocket = async () => {
    //usando la variable SOCKET creada al inicio del archivo
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online')
    })

    socket.on('disconnect', () => {
        console.log('disconnect')
    })

    socket.on('recibir-mensajes', (payload) => {
        // TODO:
        console.log('recibir-mensajes', payload)
        dibujarMensaje(payload)
    })

    socket.on('usuarios-activos', (payload) => {
        // TODO:
        console.log(payload)
        dibujarUsuarios(payload);
    })

    socket.on('mensaje-privado', (payload) => [
        // TODO:
        console.log('privado', payload)
    ])
}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(usuario => {
        usersHtml+= `
        <li>
            <p>
                <h5 class="text-success">${usuario.nombre}</h5>
                <span class="fs-6 text-muted">${usuario.uid}</span>
            </p>
        </li>`
    });

    ulUsuarios.innerHTML = usersHtml
}

const dibujarMensaje = (mensajes = []) => {
    console.log('dibujar mensaje', mensajes)
    let mensajesHtml = '';
    mensajes.forEach(mensaje => {
        mensajesHtml+= `
        <li>
            <p>
                <span class="text-primary">${mensaje.nombre}</span>
                <span>${mensaje.mensaje}</span>
            </p>
        </li>`
    });

    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({keyCode}) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if(keyCode === 13 && mensaje.length > 0) {
        socket.emit('enviar-mensaje', {mensaje, uid})
    }
})

const main = async () => {
    await validarJWT ();
}

main();

// const socket = io();

