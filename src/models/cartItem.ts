import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../utils/database";

interface CartItemAttributes {
    id: number;
    quantity: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, "id"> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

CartItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "cartItem",
        sequelize,
    }
);

export default CartItem;
