import Sequelize from "sequelize";

import db from "../utils/database";

const ShippingInfo = db.define("shippingInfo", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    postalCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

export default ShippingInfo;
