const Sequelize = require('sequelize');

const db = require('../utils/database');

const CartItem = db.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: Sequelize.INTEGER,
});

module.exports = CartItem;

export {};
