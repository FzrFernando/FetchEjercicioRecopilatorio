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
    userForm.addEventListener('submit', (event)=> {
        event.preventDefault()
        const user = {
            name : document.getElementById("name").value,
            address : document.getElementById("address").value,
            email : document.getElementById("email").value
        }

        if (user.name && user.address && validateEmail(user.email)){
            
            if (userForm.dataset.editing) {
                let userId = event.target.dataset.id;

                fetch(`${URL}/users/${userId}`,{
                    method:'PUT',
                    body: JSON.stringify(user),
                    headers: {
                        'Content-Type':'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        this.location.reload();
                        return response.json();
                    }
                    return Promise.reject(response)
                })
                .catch(err => {
                    console.log('Error en la petición HTTP:' + err.message);
                })
            } else {
                fetch(`${URL}/users`,{
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: {
                        'Content-Type':'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `${user.name} : ${user.address} : ${user.email} : <button class="edit" value="${user.id}">Editar</button> <button class="delete" value="${user.id}">Delete</button>`;
                        userList.appendChild(listItem);
                        return response.json();
                    }
                    return Promise.reject(response)
                })
                .catch(err => {
                    console.log('Error en la petición HTTP:' + err.message);
                })
            }
        }
        userForm.reset()
    })

    function deleteUser(event){
        if (event.target.classList.contains("delete")) {
            const listItem = event.target.parentElement;
            let userId = event.target.getAttribute("value");
            fetch(`${URL}/users/${userId}`,{
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    listItem.remove();
                    return response.json();
                }
                return Promise.reject(response)
            })
            .catch(err => {
                console.log('Error en la petición HTTP:' + err.message);
            })
        }
    }

    function editUser(event){
        if (event.target.classList.contains("edit")){
            const listItem = event.target.parentElement;
            const userArray = listItem.textContent.split(" : ");
            const name = userArray[0];
            const address = userArray[1];
            const email = userArray[2];
            const id = event.target.getAttribute("value");
            
            userForm.setAttribute("data-id",id);
            userForm.elements.name.value = name;
            userForm.elements.address.value = address;
            userForm.elements.email.value = email;
            userForm.dataset.editing = email;
            userForm.querySelector("button[type='submit']").textContent = "Editar Usuario";
            userForm.dataset.editingIndex = [...userList.children].indexOf(listItem);
        }
    }

    userList.addEventListener("click", function (event) {
        deleteUser(event);
        editUser(event);
    });
})