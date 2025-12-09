// src/app.js
const express = require('express');
const path = require('path');
const app = express();

const gestionRoutes = require('./routes/gestion.routes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

// ---- NUEVO: servir carpeta public ----
app.use(express.static(path.join(__dirname, '..', 'public')));
// --------------------------------------

// Registrar rutas API
app.use('/api/gestiones', gestionRoutes);

// Middleware centralizado de errores
app.use(errorHandler);

module.exports = app;

