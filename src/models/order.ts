import { Model, DataTypes, Optional, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManySetAssociationsMixin } from "sequelize";

import sequelize from "../utils/database";
import Product from "./product";

type OrderStatus = "processing" | "shipped" | "delivered";

interface OrderAttributes {
    id: number;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: OrderStatus;
    deliveredAt: Date | null;
    paidAt: Date | null;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public itemsPrice!: number;
    public taxPrice!: number;
    public shippingPrice!: number;
    public totalPrice!: number;
    public orderStatus!: OrderStatus;
    public deliveredAt!: Date | null;
    public paidAt!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProducts!: HasManyAddAssociationMixin<Product, number>;
    public hasProducts!: HasManyHasAssociationMixin<Product, number>;
    public setProducts!: HasManySetAssociationsMixin<Product, number>;

    public static associations: {
        products: Association<Order, Product>;
    };
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        itemsPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0,
        },
        taxPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0,
        },
        shippingPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0,
        },
        totalPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0,
        },
        orderStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["processing", "shipped", "delivered"]],
            },
        },
        deliveredAt: {
            type: DataTypes.DATE,
        },
        paidAt: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "order",
        sequelize,
    }
);

export default Order;
