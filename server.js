const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const dataJSON = require('./statsWorlds2024.json');

const app = express();
const db = new Datastore(); // Base de datos en memoria

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Función de middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({ error: err.message || 'Error interno del servidor' });
};

// Validación de datos
const validateData = (req, res, next) => {
    const data = req.body;

    // Campos requeridos y sus tipos esperados
    const requiredFields = {
        TeamName: 'string',
        PlayerName: 'string',
        Position: 'string',
        Country: 'string',
        id: 'int',
    };

    const campos = {
        Games: 'int',
        Winrate: "float",
        KDA: "float",
        Avgkills: "float",
        Avgdeaths: "float",
        Avgassists: "float",
        CSPerMin: "float",
        GoldPerMin: "float",
        KP: "float",
        DamagePercent: "float",
        DPM: "float",
        VSPM: "float",
        AvgWPM: "float",
        AvgWCPM: "float",
        AvgVWPM: "float",
        GD15: "float",
        CSD15: "float",
        XPD15: "float",
        FB: "float",
        FBVictim: "float",
        PentaKills: "int",
        SoloKills: "int",
        FlashKeybind: "string"
    }

    for (const [field, type] of Object.entries(requiredFields)) {
        if (!(field in data)) {
            return res.status(400).send({ error: `El campo "${field}" es requerido.` });
        }
        if (typeof data[field] !== type && !(type === 'int' && !isNaN(parseFloat(data[field])))) {
            return res.status(400).send({ error: `El campo "${field}" debe ser de tipo "${type}".` });
        }
    }



    for (const field in campos) {
        if (campos[field] === 'int' && typeof data[field] === 'string') {
            data[field] = parseFloat(data[field]);
        }
        if (campos[field] === 'float' && typeof data[field] === 'string') {
            data[field] = parseFloat(data[field]);
        }
    }


    req.body = data; // Normaliza datos numéricos
    next();
};

// **GET /loadInitialData** - Carga inicial de datos
app.get('/loadInitialData', (req, res, next) => {
    // Lista de campos que deben ser convertidos a números
    const numericFields = [
        "id", "Games", "Winrate", "KDA", "Avgkills", "Avgdeaths", "Avgassists",
        "CSPerMin", "GoldPerMin", "KP", "DamagePercent", "DPM", "VSPM",
        "AvgWPM", "AvgWCPM", "AvgVWPM", "GD15", "CSD15", "XPD15", 
        "FB", "FBVictim", "PentaKills", "SoloKills"
    ];

    // Convertir los campos numéricos en el archivo de datos antes de insertarlos y eliminar _id
    const convertedData = dataJSON.map(item => {
        // Convertir campos numéricos
        numericFields.forEach(field => {
            if (item[field] && typeof item[field] === "string") {
                item[field] = parseFloat(item[field]);
            }
        });

        // Eliminar el campo _id si existe
        delete item._id;

        return item;
    });

    // Limpiar la base de datos antes de cargar los nuevos datos
    db.remove({}, { multi: true }, (err) => {
        if (err) return next({ status: 500, message: 'Error al limpiar la base de datos' });
        
        // Insertar los datos convertidos y sin el campo _id en la base de datos
        db.insert(convertedData, (err, newDocs) => {
            if (err) return next({ status: 500, message: 'Error al insertar datos iniciales' });

            newDocs.forEach(doc => {
                delete doc._id;  // Eliminar _id si lo añade NeDB
            });

            res.status(200).send({ message: 'Datos iniciales cargados', data: newDocs });
        });
    });
});


// **GET /data** - Devuelve todos los datos con query parameters
app.get('/Worlds2024', (req, res, next) => {
    const { from, to, limit, offset, ...filters } = req.query;

    const query = {};

    // Lista de campos que deben convertirse a números
    const numericFields = [
        "id", "Games", "Winrate", "KDA", "Avgkills", "Avgdeaths", "Avgassists",
        "CSPerMin", "GoldPerMin", "KP", "DamagePercent", "DPM", "VSPM",
        "AvgWPM", "AvgWCPM", "AvgVWPM", "GD15", "CSD15", "XPD15", 
        "FB", "FBVictim", "PentaKills", "SoloKills"
    ];

    // Validar y convertir parámetros de consulta
    try {
        // Validar filtros específicos
        Object.entries(filters).forEach(([key, value]) => {
            if (numericFields.includes(key)) {
                const numericValue = parseFloat(value);
                if (isNaN(numericValue)) {
                    throw new Error(`El valor para el campo '${key}' debe ser un número.`);
                }
                query[key] = numericValue;
            } else {
                query[key] = value; // Campos no numéricos se mantienen como están
            }
        });

        // Validar parámetros de paginación
        if (from && isNaN(parseFloat(from))) {
            throw new Error("El parámetro 'from' debe ser un número.");
        }
        if (to && isNaN(parseFloat(to))) {
            throw new Error("El parámetro 'to' debe ser un número.");
        }
        if (limit && (isNaN(parseInt(limit)) || parseInt(limit) < 0)) {
            throw new Error("El parámetro 'limit' debe ser un número entero no negativo.");
        }
        if (offset && (isNaN(parseInt(offset)) || parseInt(offset) < 0)) {
            throw new Error("El parámetro 'offset' debe ser un número entero no negativo.");
        }
    } catch (err) {
        return res.status(400).send({ error: `Bad Request: ${err.message}` });
    }

    // Realizar la consulta a la base de datos
    db.find(query).exec((err, docs) => {
        if (err) return next({ status: 500, message: 'Error al obtener los datos' });
        if (!docs || docs.length === 0) return res.status(404).send({ error: 'No se encontraron datos' });

        // Convertir todos los campos numéricos en los documentos obtenidos
        const normalizedDocs = docs.map(doc => {
            numericFields.forEach(field => {
                if (doc[field] && typeof doc[field] === "string") {
                    doc[field] = parseFloat(doc[field]); // Convierte el campo a número
                }
            });
            delete doc._id; // Eliminar _id si lo añade NeDB
            return doc;
        });

        // Filtros adicionales por rango (`from` y `to`) en el campo "id"
        const results = normalizedDocs.filter(doc => {
            return (
                (!from || doc.id >= parseFloat(from)) &&
                (!to || doc.id <= parseFloat(to))
            );
        });

        // Aplicar paginación (`offset` y `limit`)
        const limitedResults = results.slice(
            parseInt(offset) || 0, 
            (parseInt(offset) || 0) + (parseInt(limit) || results.length)
        );

        res.status(200).send(limitedResults);
    });
});



// **GET /data/:id** - Devuelve un elemento por ID
app.get('/Worlds2024/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    db.find({ id }, (err, docs) => {
        if (err) return next({ status: 500, message: 'Error al buscar el elemento' });
        if (!docs || docs.length === 0) return res.status(404).send({ error: `Elemento con ID ${id} no encontrado` });
        docs.forEach(doc => {
            delete doc._id;  // Eliminar _id si lo añade NeDB
        });
        res.status(200).send(docs[0]);
    });
});

// **POST /data** - Agrega un nuevo elemento
app.post('/Worlds2024', validateData, (req, res, next) => {
    const newItem = req.body;

    db.findOne({ id: newItem.id }, (err, doc) => {
        if (err) return next({ status: 500, message: 'Error al verificar ID existente' });
        if (doc) return res.status(400).send({ error: `El ID ${newItem.id} ya existe` });
       
        db.insert(newItem, (err, newDoc) => {
            if (err) return next({ status: 500, message: 'Error al insertar el elemento' });
          
            res.status(201).send(newDoc);
        });
    });
});

app.post('/Worlds2024/:id', validateData, (req, res, next) => {
    return res.status(405).send({ error: "Método no permitido"});
}
);

// **PUT /data/:id** - Actualiza un elemento por ID
app.put('/Worlds2024/:id', validateData, (req, res, next) => {
    const id = parseInt(req.params.id);
    
 // Validar que el ID sea un número válido
    if (isNaN(id)) {
        return res.status(400).send({ error: "Bad Request: El parámetro 'id' debe ser un número válido." });
    }

    const updatedData = req.body;

    // Validar que los datos no estén vacíos
    if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).send({ error: "Bad Request: No se proporcionaron datos para actualizar." });
    }


    db.update({ id }, { $set: updatedData }, {}, (err, numReplaced) => {
        if (err) return next({ status: 500, message: 'Error al actualizar el elemento' });
        if (numReplaced === 0) return res.status(404).send({ error: `Elemento con ID ${id} no encontrado` });
        
        res.status(204).send();
    });
});

app.put('/Worlds2024', validateData, (req, res, next) => {
    return res.status(405).send({ error: "Método no permitido"});
}
);

// **DELETE /data/:id** - Elimina un elemento por ID
app.delete('/Worlds2024/:id', (req, res, next) => {
    const id = parseInt(req.params.id);

    db.remove({ id }, {}, (err, numRemoved) => {
        if (err) return next({ status: 500, message: 'Error al eliminar el elemento' });
        if (numRemoved === 0) return res.status(404).send({ error: `Elemento con ID ${id} no encontrado` });
        res.status(204).send();
    });
});

app.delete('/Worlds2024', validateData, (req, res, next) => {
    return res.status(405).send({ error: "Método no permitido"});
}
);

// Operaciones no permitidas
app.all('/Worlds2024/:id', (req, res) => res.status(405).send({ error: 'Método no permitido' }));
app.all('/Worlds2024', (req, res) => res.status(405).send({ error: 'Método no permitido' }));

// Middleware para manejar errores
app.use(errorHandler);

// Inicia el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
