// src/validations/gestion.schema.js
const Joi = require('joi');

const tipificaciones = [
  'Contacto Efectivo',
  'No Contacto',
  'Promesa de Pago',
  'Pago Realizado',
  'Refinanciación',
  'Información',
  'Escalamiento',
  'Otros'
];

const createSchema = Joi.object({
  clienteDocumento: Joi.string().required(),
  clienteNombre: Joi.string().required(),
  asesorId: Joi.string().required(),
  tipificacion: Joi.string().valid(...tipificaciones).required(),
  subtipificacion: Joi.string().allow(null, ''),
  canalOficial: Joi.boolean().default(true),
  valorCompromiso: Joi.number().precision(2).min(0).optional().allow(null),
  fechaCompromiso: Joi.date().iso().optional().allow(null),
  observaciones: Joi.string().max(1000).optional().allow(null, ''),
  recordingUrl: Joi.string().uri().optional().allow(null, ''),
  estado: Joi.string().valid('abierta', 'cerrada').optional()
});

const updateSchema = Joi.object({
  clienteDocumento: Joi.string().optional(),
  clienteNombre: Joi.string().optional(),
  asesorId: Joi.string().optional(),
  tipificacion: Joi.string().valid(...tipificaciones).optional(),
  subtipificacion: Joi.string().optional().allow(null, ''),
  canalOficial: Joi.boolean().optional(),
  valorCompromiso: Joi.number().precision(2).min(0).optional().allow(null),
  fechaCompromiso: Joi.date().iso().optional().allow(null),
  observaciones: Joi.string().max(1000).optional().allow(null, ''),
  recordingUrl: Joi.string().uri().optional().allow(null, ''),
  estado: Joi.string().valid('abierta', 'cerrada').optional()
});

module.exports = {
  createSchema,
  updateSchema
};
