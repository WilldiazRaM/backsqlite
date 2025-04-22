// Importa el módulo Express
const express = require('express');
// Crea una instancia de la aplicación Express
const app = express();

// Importa la configuración de la base de datos SQLite
const db = require('./Config/database');

// Importa el middleware 'morgan' para logging de peticiones HTTP
const morgan = require('morgan');


// Middleware para registrar en consola las peticiones HTTP (modo 'dev')
app.use(morgan('dev'));


// Middleware para parsear cuerpos JSON en las solicitudes
app.use(express.json());

// Define el puerto en el que correrá el servidor (usa el puerto definido en el entorno o el 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Ruta principal (GET /) que responde con un mensaje simple
app.get('/', (req, res) => {
    res.send('HOLA MUNDO!');
});


// Ruta para crear un nuevo usuario (POST /usuarios)
app.post('/usuarios', (req, res, next) => {
    // Extrae los datos del cuerpo de la solicitud
    const { nombre, correo, contraseña } = req.body;

    // Valida que no falten campos obligatorios
    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ success: false, message: 'Faltan campos' });
    }

    // Query SQL para insertar un nuevo usuario
    const query = `INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)`;

    // Ejecuta la consulta usando parámetros seguros
    db.run(query, [nombre, correo, contraseña], function (err) {
        if (err) return next(err); // Pasa el error al middleware de manejo de errores
        // Responde con los datos del nuevo usuario creado
        res.json({ success: true, id: this.lastID, nombre, correo });
    });
});


// Ruta para obtener todos los usuarios (GET /usuarios)
app.get('/usuarios', (req, res, next) => {
    // Ejecuta una consulta SELECT para traer los usuarios
    db.all('SELECT id, nombre, correo FROM usuarios', (err, rows) => {
        if (err) return next(err); // Pasa el error al middleware de manejo de errores
        // Devuelve la lista de usuarios en formato JSON
        res.json(rows);
    });
});


// Middleware global para capturar y responder a errores
app.use((err, req, res, next) => {
    console.error('🛑 Error capturado:', err.stack || err.message || err);

    // Usa el código de estado del error o 500 por defecto
    const statusCode = err.statusCode || 500;

    // Responde con un mensaje de error
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
    });
});


// Inicia el servidor y escucha en el puerto definido
app.listen(PORT, () => {
    console.log(` Servidor corriendo en el puerto: ${PORT}`);
    console.log(` Abre localmente en : http://localhost:${PORT}`);
});
