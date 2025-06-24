const express = require('express');
const config = require('./config');
const clientes = require('./molulos/clientes/rutas');
const usuario = require('./molulos/users/rutas');
const luces = require('./molulos/luces/rutas');
const puertas = require('./molulos/puertas/rutas')

const cors = require('cors');

const app = express();
app.use(express.json());

// Configuracion
app.set('port', config.app.port);

// Permitir conexión externa usando "cors"
app.use(cors());

// Rutas
app.use('/api/clientes',clientes)
app.use('/api/usuario',usuario)
app.use('/api/luces', luces)
app.use('/api/puertas', puertas)

module.exports = app;
