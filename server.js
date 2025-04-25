// Importa el módulo Express para crear el servidor
const express = require('express');

// Importa el módulo CORS para permitir peticiones desde otros orígenes (como apps móviles o frontends externos)
const cors = require('cors');

// Crea una instancia de la aplicación Express
const app = express();

// Importa la configuración de la base de datos SQLite
const db = require('./Config/database');

// Importa 'morgan' para registrar en consola todas las peticiones HTTP (útil para debug y desarrollo)
const morgan = require('morgan');

// Middleware para mostrar por consola cada petición (GET, POST, etc.) en modo desarrollo
app.use(morgan('dev'));

// Middleware para habilitar CORS (permite que tu backend sea accesible desde otras apps o dominios)
app.use(cors());

// Middleware para poder recibir y entender datos en formato JSON en las peticiones
app.use(express.json());

// Define el puerto en el que correrá el servidor (usa el del entorno si está definido, o 3000 por defecto)
const PORT = process.env.PORT || 3000;

//================= RUTAS =================//

// Ruta de prueba principal: GET /
app.get('/', (req, res) => {
    res.send('HOLA MUNDO!');
});

// Ruta para registrar un nuevo usuario: POST /usuarios
app.post('/usuarios', (req, res, next) => {
    // Extrae los datos enviados en el cuerpo de la solicitud
    const { nombre, correo, contrasena } = req.body;

    // Verifica que no falte ningún campo obligatorio
    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ success: false, message: 'Faltan campos' });
    }

    // Consulta SQL para insertar un nuevo usuario
    const query = `INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)`;

    // Ejecuta la consulta con valores seguros (evita inyección SQL)
    db.run(query, [nombre, correo, contrasena], function (err) {
        if (err) {
            // Maneja el error cuando el correo ya está registrado (violación de restricción UNIQUE)
            if (err.message.includes('UNIQUE constraint failed: usuarios.correo')) {
                return res.status(409).json({
                    success: false,
                    message: 'El correo ya está registrado',
                });
            }
            // Si es otro tipo de error, lo pasa al middleware de manejo de errores
            return next(err);
        }

        // Si el usuario se crea correctamente, responde con sus datos (sin la contraseña por seguridad)
        res.json({
            success: true,
            id: this.lastID,
            nombre,
            correo
        });
    });
});

// Ruta para obtener todos los usuarios registrados: GET /usuarios
app.get('/usuarios', (req, res, next) => {
    // Consulta SQL para seleccionar solo los campos visibles (sin contraseña)
    db.all('SELECT id, nombre, correo FROM usuarios', (err, rows) => {
        if (err) return next(err); // En caso de error, lo pasa al middleware de errores
        res.json(rows); // Devuelve los usuarios como JSON
    });
});

// Ruta para ver todos los usuarios (incluyendo la contraseña, solo para depuración): GET /debug/usuarios
app.get('/debug/usuarios', (req, res, next) => {
    db.all('SELECT * FROM usuarios', (err, rows) => {
        if (err) return next(err);
        res.json(rows);
    });
});

//================= MANEJO DE ERRORES =================//

// Middleware global para manejar errores en todas las rutas
app.use((err, req, res, next) => {
    console.error('🛑 Error capturado:', err.stack || err.message || err);

    // Si el error tiene un código de estado, lo usa; si no, responde con 500 (Error interno)
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
    });
});

//================= INICIAR SERVIDOR =================//

// HOST 0.0.0.0 permite que el servidor escuche en todas las interfaces de red (ideal para entornos Docker o móviles)
const HOST = '0.0.0.0';

// Inicia el servidor en el puerto especificado
app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en el puerto: ${PORT}`);
    console.log(`🌐 Abre localmente en: http://localhost:${PORT}`);
});
