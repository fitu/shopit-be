const Sequelize = require('sequelize');

// docker run -e POSTGRES_DB=shopit -e POSTGRES_USER=shopit -e POSTGRES_PASSWORD=computadorar postgres:9.6
const db = new Sequelize('shopit', 'shopit', 'computadorar', {
    dialect: 'postgres',
    // 172.17.0.1 as docker's localhost
    // usersDB as docker's net
    host: 'usersDB',
    port: 5432,
});

module.exports = db;