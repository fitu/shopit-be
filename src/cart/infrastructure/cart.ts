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
    Sequelize,
} from "sequelize";

import CartItem from "../../cartItem/infrastructure/cartItem";
import User from "../../user/infrastructure/user";
import { CartAttributes } from "../domain/Cart";

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

const init = (sequelize: Sequelize) => {
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
};

export { init };
export default Cart;
