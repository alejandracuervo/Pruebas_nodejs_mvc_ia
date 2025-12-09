// src/models/gestion.model.js
module.exports = (sequelize, DataTypes) => {
  const Gestion = sequelize.define(
    'Gestion',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      clienteDocumento: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clienteNombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      asesorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipificacion: {
        type: DataTypes.ENUM(
          'Contacto Efectivo',
          'No Contacto',
          'Promesa de Pago',
          'Pago Realizado',
          'Refinanciación',
          'Información',
          'Escalamiento',
          'Otros'
        ),
        allowNull: false,
      },
      subtipificacion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      canalOficial: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      valorCompromiso: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      fechaCompromiso: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      recordingUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estado: {
        type: DataTypes.ENUM('abierta', 'cerrada'),
        defaultValue: 'abierta',
        allowNull: false,
      },
    },
    {
      tableName: 'gestiones',
      timestamps: true,
    }
  );

  return Gestion;
};
