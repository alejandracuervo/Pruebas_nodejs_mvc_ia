const app = require('./app');
const sequelize = require('./config/database');
require('./models');  // <--- IMPORTANTE

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL exitosa.');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

startServer();
