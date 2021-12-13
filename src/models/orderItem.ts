import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../utils/database";

interface OrderItemAttributes {
    id: number;
    quantity: number;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id"> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OrderItem.init(
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
        tableName: "orderItem",
        sequelize,
    }
);

export default OrderItem;
