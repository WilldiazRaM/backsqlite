// Importa el módulo sqlite3 y activa el modo 'verbose' para obtener más mensajes de depuración
const sqlite3 = require('sqlite3').verbose();

// Importa 'path' para manejar rutas de archivos de forma segura y multiplataforma
const path = require('path');

// Resuelve la ruta absoluta del archivo de base de datos llamado 'database.sqlite' en el mismo directorio
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Crea o abre la base de datos SQLite en la ruta especificada
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    // Si ocurre un error al abrir la base de datos, lo muestra en consola
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    // Mensaje de éxito si la conexión se establece correctamente
    console.log(' Conectado a la base de datos SQLite');
  }
});

// Crea la tabla 'usuarios' si no existe aún, con las siguientes columnas:
// - id: identificador único, autoincrementable
// - nombre: texto obligatorio
// - correo: texto obligatorio y único (no puede repetirse)
// - contrasena: texto obligatorio
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    contrasena TEXT NOT NULL
  )
`);

// Exporta el objeto de base de datos para usarlo en otras partes de la aplicación
module.exports = db;
