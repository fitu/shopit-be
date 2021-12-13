import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
} from "sequelize";

import sequelize from "../utils/database";
import Product from "./product";

interface CartAttributes {
    id: number;
    itemsPrice: number;
    taxPrice: number;
    totalPrice: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: number;
    public itemsPrice!: number;
    public taxPrice!: number;
    public totalPrice!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProduct!: HasManyAddAssociationMixin<Product, number>;
    public hasProducts!: HasManyHasAssociationMixin<Product, number>;
    public setProducts!: HasManySetAssociationsMixin<Product, number>;

    public static associations: {
        products: Association<Cart, Product>;
    };
}

Cart.init(
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
        totalPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0,
        },
    },
    {
        tableName: "cart",
        sequelize,
    }
);

export default Cart;
