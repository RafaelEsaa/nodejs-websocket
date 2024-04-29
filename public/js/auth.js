const url = "http://localhost:8080/api/auth/";
const miFormulario = document.querySelector("form");

miFormulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {};

    for (let el of miFormulario.elements){
        if(el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(data => {
        // console.log(data)
        if(data.msg){
            return console.error(data.msg)
        }
        localStorage.setItem('token', data.token)
        window.location = 'chat.html';
    })
    .catch(err => {
        console.log(err)
    })
})

function handleCredentialResponse(response) {
  const body = { id_token: response.credential };
  fetch(url + 'google', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((resp) => {
        //   console.log(resp);
        //   localStorage.setItem("email", resp.usuario.correo);
        console.log(resp)
        localStorage.setItem("token", resp.token);
        window.location = "chat.html";
    })
    .catch((error) => console.log(error));
}

const button = document.getElementById("google_signout");
button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
