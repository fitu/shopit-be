import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasOne,
    HasOneSetAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    Sequelize,
} from "sequelize";

import Product from "../../product/infrastructure/product";
import Order from "../../order/infrastructure/order";
import Cart from "../../cart/infrastructure/cart";
import Avatar from "../../avatar/infrastructure/avatar";
import Review from "../../review/infrastructure/review";
import PaymentInfo from "../../paymentInfo/infrastructure/paymentInfo";
import ShippingInfo from "../../shippingInfo/infrastructure/shippingInfo";
import { UserAttributes, UserRole } from "../domain/User";

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public role!: UserRole;
    public password!: string;
    public resetPasswordToken!: string | null;
    public resetPasswordExpire!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProducts!: HasManyAddAssociationMixin<Product, number>;
    public hasProducts!: HasManyHasAssociationMixin<Product, number>;
    public setProducts!: HasManySetAssociationsMixin<Product, number>;
    public countProducts!: HasManyCountAssociationsMixin;

    public getOrders!: HasManyGetAssociationsMixin<Order>;
    public addOrders!: HasManyAddAssociationMixin<Order, number>;
    public hasOrders!: HasManyHasAssociationMixin<Order, number>;
    public setOrders!: HasManySetAssociationsMixin<Order, number>;
    public countOrders!: HasManyCountAssociationsMixin;

    public getCart!: HasOne<Cart>;
    public setCart!: HasOneSetAssociationMixin<Cart, number>;

    public getAvatar!: HasOne<Avatar>;
    public setAvatar!: HasOneSetAssociationMixin<Avatar, number>;

    public getReviews!: HasManyGetAssociationsMixin<Review>;
    public addReviews!: HasManyAddAssociationMixin<Review, number>;
    public hasReviews!: HasManyHasAssociationMixin<Review, number>;
    public setReviews!: HasManySetAssociationsMixin<Review, number>;
    public countReviews!: HasManyCountAssociationsMixin;

    public getPaymentsInfo!: HasManyGetAssociationsMixin<PaymentInfo>;
    public addPaymentsInfo!: HasManyAddAssociationMixin<PaymentInfo, number>;
    public hasPaymentsInfo!: HasManyHasAssociationMixin<PaymentInfo, number>;
    public setPaymentsInfo!: HasManySetAssociationsMixin<PaymentInfo, number>;
    public countPaymentsInfo!: HasManyCountAssociationsMixin;

    public getShippingsInfo!: HasManyGetAssociationsMixin<ShippingInfo>;
    public addShippingsInfo!: HasManyAddAssociationMixin<ShippingInfo, number>;
    public hasShippingsInfo!: HasManyHasAssociationMixin<ShippingInfo, number>;
    public setShippingsInfo!: HasManySetAssociationsMixin<ShippingInfo, number>;
    public countShippingsInfo!: HasManyCountAssociationsMixin;

    public readonly products?: Array<Product>;
    public readonly orders?: Array<Order>;
    public readonly cart?: Cart;
    public readonly avatar?: Avatar;
    public readonly reviews?: Array<Review>;
    public readonly paymentsInfo?: Array<PaymentInfo>;
    public readonly shippingsInfo?: Array<ShippingInfo>;

    public static associations: {
        products: Association<User, Product>;
        orders: Association<User, Order>;
        cart: Association<User, Cart>;
        avatar: Association<User, Avatar>;
        review: Association<User, Review>;
        paymentsInfo: Association<User, PaymentInfo>;
        shippingsInfo: Association<User, ShippingInfo>;
    };
}

const init = (sequelize: Sequelize) => {
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
};

export { init };
export default User;
