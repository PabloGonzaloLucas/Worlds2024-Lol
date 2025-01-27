<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Tester</title>

</head>
<body>
    <h1>Probador de API</h1>
    
    <form id="api-form">
        <label for="method">Método:</label>
        <select id="method" name="method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
        </select><br><br>
        
        <label for="url">URL de la API:</label>
        <input type="text" id="url" name="url" placeholder="Ingresa la URL" required><br><br>
        
        <label for="json-body">JSON (solo para POST y PUT):</label>
        <textarea id="json-body" name="json-body" rows="4" cols="50" placeholder="Ingresa el cuerpo en JSON"></textarea><br><br>
        
        <button type="submit">Enviar solicitud</button>
    </form>
    
    <h2>Respuesta de la API:</h2>
    <pre id="response"></pre>

    <script src="ajax.js"></script>

    <?php
    $usuario = setcookie("Usuario","Estudiante",30);
    echo $usuario;
    ?>
</body>
</html>
