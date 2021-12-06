const Sequelize = require('sequelize');
const db = require('../utils/database');

const PaymentInfo = db.define('paymentInfo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: ['not-paid', 'paid'],
        },
    },
});

module.exports = PaymentInfo;

export {};
