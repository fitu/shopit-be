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

import CartItemDao from "../../cartItem/infrastructure/CartItemDao";
import UserDao from "../../user/infrastructure/UserDao";
import Cart from "../domain/Cart";

interface CartAttributes {
    id: number;
    itemsPrice: number;
    taxPrice: number;
    totalPrice: number;
    userId: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

class CartDao extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: number;
    public itemsPrice!: number;
    public taxPrice!: number;
    public totalPrice!: number;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getCartItems!: HasManyGetAssociationsMixin<CartItemDao>;
    public addCartItems!: HasManyAddAssociationMixin<CartItemDao, number>;
    public hasCartItems!: HasManyHasAssociationMixin<CartItemDao, number>;
    public setCartItems!: HasManySetAssociationsMixin<CartItemDao, number>;
    public countCartItems!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public readonly cartItems?: Array<CartItemDao>;
    public readonly user?: UserDao;

    public static associations: {
        cartItems: Association<CartDao, CartItemDao>;
        user: Association<CartDao, UserDao>;
    };

    public toModel(): Cart {
        return {
            id: this.id,
            itemsPrice: this.itemsPrice,
            taxPrice: this.taxPrice,
            totalPrice: this.totalPrice,
        };
    }
}

const init = (sequelize: Sequelize) => {
    CartDao.init(
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
            userId: {
                type: DataTypes.INTEGER,
            }
        },
        {
            tableName: "cart",
            sequelize,
        }
    );
};

export { init };
export default CartDao;
