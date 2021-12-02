const Sequelize = require('sequelize');

const db = new Sequelize('shopit', 'shopit', 'computadorar', {
    dialect: 'postgres',
    host: 'usersDB',
    port: 5432,
});

module.exports = db;