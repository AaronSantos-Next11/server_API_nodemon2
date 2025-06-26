const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas')
const controlador = require('./controlador');

router.get('/', async function (req, res) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, 200, items);
    } catch (error) {
        respuesta.error(req, res, 500, 'Error al obtener datos', error);
    }
});

router.get('/:id', async function (req, res) {
    try {
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, 200, items);
    } catch (error) {
        respuesta.error(req, res, 500, 'Error al obtener datos', error);
    }
});

router.post('/agregar', async function (req, res) {
    try {
        const items = await controlador.agregar(req.body);
            if (req.body.id == 0) {
              mensaje = 'Datos insertados'
            } else {
              mensaje = 'Datos actualizados'
            }
        respuesta.success(req, res, 200, items);
    } catch (error) {
        respuesta.error(req, res, 500, 'Error al obtener datos', error);  
    }
});

router.post('/actualizar', async (req, res) => {
    try {
        const data = await controlador.actualizar(req.body);
        respuesta.success(req, res, 200, 'Puerta actualizada correctamente');
    } catch (e) {
        respuesta.error(req, res, 500, 'Error al actualizar puerta', e);
    }
});


router.delete('/eliminar', async function (req, res) {
    try {
      const items = await controlador.eliminar(req.body); // Obtine los datos que se han eliminado
      respuesta.success(req, res, 200, 'dato eliminado', items); // Muestra que funcionó y muestra los datos eliminados
    } catch (error) {
      respuesta.error(req, res, 500, 'Error al obtener datos', error);
    }
});

// Antes del module.exports
router.post('/actualizar_status', async function (req, res) {
    try {
        const resultado = await controlador.actualizar_status(req.body);
        
        if (resultado.status) {
            respuesta.success(req, res, 200, resultado.mensaje, resultado.resultado);
        } else {
            respuesta.error(req, res, 400, resultado.mensaje);
        }
    } catch (error) {
        respuesta.error(req, res, 500, 'Error al actualizar status', error);
    }
});

module.exports = router