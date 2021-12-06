const Sequelize = require('sequelize');
const db = require('../utils/database');

const Product = db.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            max: 100,
        },
    },
    title: Sequelize.STRING,
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
    ratings: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home',
            ],
        },
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

module.exports = Product;

export {};
