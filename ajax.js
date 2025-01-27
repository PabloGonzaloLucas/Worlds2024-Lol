document.getElementById("api-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    const method = document.getElementById("method").value;
    const url = document.getElementById("url").value;
    const jsonBody = document.getElementById("json-body").value;

    let options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Si es POST o PUT, agregamos el cuerpo (body)
    if (method === "POST" || method === "PUT") {
        if (jsonBody.trim() !== "") {
            options.body = jsonBody; // Usamos el JSON que el usuario ingresa
        } else {
            alert("Por favor, ingresa un JSON válido.");
            return;
        }
    }

    // Realizamos la solicitud usando fetch
    fetch(url, options)
        .then(response => response.json()) // Intentamos convertir la respuesta a JSON
        .then(data => {
            document.getElementById("response").textContent = JSON.stringify(data, null, 2); // Mostramos la respuesta
        })
        .catch(error => {
            document.getElementById("response").textContent = `Error: ${error.message}`; // En caso de error
        });
});
