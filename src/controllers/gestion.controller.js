// src/controllers/gestion.controller.js
const GestionService = require('../services/gestion.service');

class GestionController {
  // POST /gestiones
  static async create(req, res, next) {
    try {
      const result = await GestionService.create(req.body);
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /gestiones
  static async list(req, res, next) {
    try {
      const { page, limit, q, tipificacion, asesorId, desde, hasta } = req.query;
      const result = await GestionService.list({ page, limit, q, tipificacion, asesorId, desde, hasta });

      res.json({
        status: "success",
        ...result,
      });

    } catch (err) {
      next(err);
    }
  }

  // GET /gestiones/:id
  static async detail(req, res, next) {
    try {
      const { id } = req.params;
      const gestion = await GestionService.findById(id);

      if (!gestion) {
        return res.status(404).json({
          status: "error",
          message: "Gestión no encontrada",
        });
      }

      res.json({
        status: "success",
        data: gestion,
      });
    } catch (err) {
      next(err);
    }
  }

  // PUT /gestiones/:id
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await GestionService.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          status: "error",
          message: "Gestión no encontrada",
        });
      }

      res.json({
        status: "success",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /gestiones/:id
  static async partialUpdate(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await GestionService.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          status: "error",
          message: "Gestión no encontrada",
        });
      }

      res.json({
        status: "success",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /gestiones/:id (borrado lógico)
  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      const removed = await GestionService.softDelete(id);

      if (!removed) {
        return res.status(404).json({
          status: "error",
          message: "Gestión no encontrada",
        });
      }

      res.json({
        status: "success",
        message: "Gestión cerrada exitosamente (borrado lógico)",
        data: removed,
      });

    } catch (err) {
      next(err);
    }
  }
}

module.exports = GestionController;
