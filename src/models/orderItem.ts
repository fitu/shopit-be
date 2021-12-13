import Sequelize from "sequelize";

import db from "../utils/database";

const OrderItem = db.define("orderItem", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: Sequelize.INTEGER,
});

export default OrderItem;
