// src/models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const GestionModel = require('./gestion.model');

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Gestion = GestionModel(sequelize, Sequelize.DataTypes);

module.exports = db;

