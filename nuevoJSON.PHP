<?php
// Leer el archivo JSON
$archivo = "statsWorlds2024.json";
$jsonString = file_get_contents($archivo);

// Decodificar el JSON a un array asociativo
$datos = json_decode($jsonString, true);

// Verificar si es un array
if (is_array($datos)) {
    // Añadir el campo 'id' a cada elemento
    foreach ($datos as $indice => &$elemento) {
        $elemento['id'] = (String) $indice + 1; // Incremental a partir de 1
    }

    // Guardar los datos actualizados en un nuevo archivo JSON
    $archivoModificado = "statsWorlds2024.json";
    file_put_contents($archivoModificado, json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo "¡Campo 'id' añadido correctamente!";
} else {
    echo "El archivo JSON no contiene un array.";
}
?>
