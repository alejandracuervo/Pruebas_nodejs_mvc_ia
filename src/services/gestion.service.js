// src/services/gestion.service.js
const { Op } = require('sequelize');
const { Gestion } = require('../models');

class GestionService {
  // Crear gestión
  static async create(data) {
    return await Gestion.create(data);
  }

  // Obtener una gestión por ID
  static async findById(id) {
    return await Gestion.findByPk(id);
  }

  // Actualización total (PUT)
  static async update(id, data) {
    const gestion = await Gestion.findByPk(id);
    if (!gestion) return null;

    await gestion.update(data);
    return gestion;
  }

  // Borrado lógico → cambiar estado a "cerrada"
  static async softDelete(id) {
    const gestion = await Gestion.findByPk(id);
    if (!gestion) return null;

    await gestion.update({ estado: "cerrada" });
    return gestion;
  }

  // Listar con filtros + paginación
  static async list({ page = 1, limit = 10, q, tipificacion, asesorId, desde, hasta }) {

    const offset = (page - 1) * limit;

    const where = {};

    // Búsqueda por nombre o documento
    if (q) {
      where[Op.or] = [
        { clienteNombre: { [Op.like]: `%${q}%` } },
        { clienteDocumento: { [Op.like]: `%${q}%` } }
      ];
    }

    // Filtro por tipificación
    if (tipificacion) {
      where.tipificacion = tipificacion;
    }

    // Filtro por asesor
    if (asesorId) {
      where.asesorId = asesorId;
    }

    // Filtros por rango de fecha (fecha de creación)
    if (desde || hasta) {
      where.createdAt = {};

      if (desde) where.createdAt[Op.gte] = new Date(desde);
      if (hasta) where.createdAt[Op.lte] = new Date(hasta);
    }

    // Ejecutar consulta con paginación
    const { rows, count } = await Gestion.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit, 10),
      order: [['createdAt', 'DESC']]
    });

    return {
      data: rows,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

module.exports = GestionService;
