const Sequelize = require("sequelize");

const connection = new Sequelize("guiapress", "root", "21111987Ipa", {
  host: "localhost",
  dialect: "mysql",
  timezone: "-03:00" // timezone do horário de Brasília
});

module.exports = connection;
