import {
    Model,
    DataTypes,
    Optional,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Sequelize,
} from "sequelize";

import CartItemDao from "../../../cartItem/infrastructure/sql/CartItemDao";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Cart from "../../domain/Cart";

interface CartAttributes {
    id: number;
    itemsPrice: number;
    taxPrice: number;
    totalPrice: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

class CartDao extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: number;
    public itemsPrice!: number;
    public taxPrice!: number;
    public totalPrice!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // public readonly cartItems?: Array<CartItemDao>;

    // public getCartItems!: HasManyGetAssociationsMixin<CartItemDao>;
    // public addCartItems!: HasManyAddAssociationMixin<CartItemDao, number>;
    // public hasCartItems!: HasManyHasAssociationMixin<CartItemDao, number>;
    // public setCartItems!: HasManySetAssociationsMixin<CartItemDao, number>;
    // public countCartItems!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

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
                type: DataTypes.INTEGER.UNSIGNED,
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
export default CartDao;
