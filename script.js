document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");
    const URL = `http://localhost:3000`;

    // Función para validar email
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }

    // Fetch para conseguir todos los usuarios
    fetch(`${URL}/users`)
    .then((response) => response.json())
    .then((data) => {
        data.forEach(user => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `${user.name} : ${user.address} : ${user.email} : <button class="edit" value="${user.id}">Editar</button> <button class="delete" value="${user.id}">Delete</button>`;
            userList.appendChild(listItem);
        });
    })
    .catch(error => console.log(error))

    // Añadir usuario
    fetch(`${URL}/users`,{
        method: 'POST',
        body: JSON.stringify(),
        headers: {
            'Content-Type':'application/json'
        }
    })

})