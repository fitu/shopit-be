const Sequelize = require('sequelize');
const db = require('../utils/database');

const Order = db.define('order', {
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
    shippingPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
    totalPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
    orderStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: ['processing', 'shipped', 'delivered'],
        },
    },
    deliveredAt: {
        type: Sequelize.DATE,
    },
    paidAt: {
        type: Sequelize.DATE,
    },
});

module.exports = Order;

export {};
