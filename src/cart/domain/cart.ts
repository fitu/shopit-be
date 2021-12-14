import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
} from "sequelize";

import sequelize from "../../shared/db/database";
import CartItem from "../../cartItem/domain/cartItem";
import User from "../../user/domain/user";

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

    public getCartItems!: HasManyGetAssociationsMixin<CartItem>;
    public addCartItems!: HasManyAddAssociationMixin<CartItem, number>;
    public hasCartItems!: HasManyHasAssociationMixin<CartItem, number>;
    public setCartItems!: HasManySetAssociationsMixin<CartItem, number>;
    public countCartItems!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<User>;
    public setUser!: HasOneSetAssociationMixin<User, number>;

    public readonly cartItems?: Array<CartItem>;
    public readonly user?: User;

    public static associations: {
        cartItems: Association<Cart, CartItem>;
        user: Association<Cart, User>;
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
