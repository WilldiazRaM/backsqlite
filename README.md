# 🟢 Backend Node.js + Express + SQLite

Este es un backend básico desarrollado con **Node.js**, **Express** y **SQLite3** que permite registrar y consultar usuarios. Está pensado para integrarse con aplicaciones móviles o frontends web.

## 📁 Estructura del Proyecto

```
backsqlite/
├── Config/
│   └── database.js         # Configuración y conexión a la base de datos SQLite
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Dependencias y scripts del proyecto
├── package-lock.json       # Versión exacta de cada dependencia instalada
├── server.js               # Servidor Express y definición de rutas
└── README.md               # Documentación del proyecto
```

## ⚙️ Requisitos

- Node.js (versión 14 o superior)
- Git (opcional, para clonar el repositorio)

## 🚀 Instalación y ejecución

Sigue estos pasos para instalar y levantar el servidor en tu máquina local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/backsqlite.git
cd backsqlite
```

> 🔁 Reemplaza el enlace del repositorio por el tuyo si es privado o alojado en otro lado.

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Ejecutar el servidor

```bash
node server.js
```

### 4. Verificar el backend

Una vez que el servidor esté en marcha, abre tu navegador y visita:

```
http://localhost:3000
```

Deberías ver el mensaje: `HOLA MUNDO!`

---

## 📡 Endpoints disponibles

| Método | Ruta                 | Descripción                            |
|--------|----------------------|----------------------------------------|
| GET    | `/`                  | Ruta raíz de prueba                    |
| POST   | `/usuarios`          | Crea un nuevo usuario                  |
| GET    | `/usuarios`          | Lista todos los usuarios (sin password)|
| GET    | `/debug/usuarios`    | Lista todos los usuarios (incluye password, solo para debug) |
|  GET	 | `/usuarios/:id`	    |Obtiene un usuario por su ID (excluye contraseña). |
| PUT	 | `/usuarios/:id`	    |Actualiza un usuario por ID (campos editables: nombre, correo, contrasena). |
| DELETE |	`/usuarios/:id`	    | Elimina un usuario por ID. |
|GET	 | `/debug/usuarios`	(Opcional) Lista todos los usuarios incluyendo contraseñas (uso interno/debug). |

## 🛡️ Notas de seguridad

- No exponer el endpoint `/debug/usuarios` en producción.
- Implementar hashing de contraseñas (como `bcrypt`) en futuras versiones.

## 📝 Licencia

Este proyecto está disponible bajo la licencia MIT.  
Puedes usarlo, modificarlo y distribuirlo libremente.

---
