const Sequelize = require('sequelize');

const db = require('../utils/database');

const Cart = db.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    itemsPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
    taxPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
    totalPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
});

module.exports = Cart;

export {};
