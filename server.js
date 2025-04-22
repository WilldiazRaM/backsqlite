const express = require('express');
const app = express();
const db = require('./Config/database');
const morgan = require('morgan');



// Middleware de logging
app.use(morgan('dev'));






app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('HOLA MUNDO!');
});



// Crear nuevo usuario
app.post('/usuarios', (req, res, next) => {
    const { nombre, correo, contraseña } = req.body;
  
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ success: false, message: 'Faltan campos' });
    }
  
    const query = `INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)`;
    db.run(query, [nombre, correo, contraseña], function (err) {
      if (err) return next(err);
      res.json({ success: true, id: this.lastID, nombre, correo });
    });
  });
  
  // Obtener todos los usuarios
  app.get('/usuarios', (req, res, next) => {
    db.all('SELECT id, nombre, correo FROM usuarios', (err, rows) => {
      if (err) return next(err);
      res.json(rows);
    });
  });






// Middleware global de manejo de errores
app.use((err, req, res, next) => {
    console.error('🛑 Error capturado:', err.stack || err.message || err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
    });
});




app.listen(PORT, () => {
  console.log(` Servidor corriendo en el puerto: ${PORT}`);
  console.log(` Abre localmente en : http://localhost:${PORT}`);
});
