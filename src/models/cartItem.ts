import Sequelize from "sequelize";

import db from "../utils/database";

const CartItem = db.define("cartItem", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: Sequelize.INTEGER,
});

export default CartItem;
