import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneCreateAssociationMixin,
    HasOne,
    HasOneSetAssociationMixin,
} from "sequelize";

import sequelize from "../utils/database";

import Product from "./product";
import Order from "./order";
import Cart from "./cart";

type Role = "user" | "admin";

interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
    resetPasswordToken: string | null;
    resetPasswordExpire: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public role!: Role;
    public password!: string;
    public resetPasswordToken!: string | null;
    public resetPasswordExpire!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProduct!: HasManyAddAssociationMixin<Product, number>;
    public hasProducts!: HasManyHasAssociationMixin<Product, number>;

    public getOrders!: HasManyGetAssociationsMixin<Order>;
    public setOrder!: HasOneSetAssociationMixin<Order, number>;
    public hasOrders!: HasManyHasAssociationMixin<Order, number>;

    public getCart!: HasOneGetAssociationMixin<Cart>;
    public addCart!: HasManyAddAssociationMixin<Cart, number>;

    public static associations: {
        products: Association<User, Product>;
        orders: Association<User, Order>;
        cart: Association<User, Cart>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 30],
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 30],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["user", "admin"]],
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 8,
            },
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
        },
        resetPasswordExpire: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "user",
        sequelize,
    }
);

export default User;
