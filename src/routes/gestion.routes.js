// src/routes/gestion.routes.js
const express = require('express');
const router = express.Router();

const GestionController = require('../controllers/gestion.controller');
const validate = require('../middlewares/validate');
const { createSchema, updateSchema } = require('../validations/gestion.schema');

// Crear gestión
router.post('/', validate(createSchema), GestionController.create);

// Listar con filtros + paginación
router.get('/', GestionController.list);

// Obtener detalle por ID
router.get('/:id', GestionController.detail);

// Actualización total (PUT)
router.put('/:id', validate(updateSchema), GestionController.update);

// Actualización parcial (PATCH)
router.patch('/:id', validate(updateSchema), GestionController.partialUpdate);

// Borrado lógico
router.delete('/:id', GestionController.remove);

module.exports = router;
