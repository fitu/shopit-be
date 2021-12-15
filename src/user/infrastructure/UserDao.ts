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

import ProductDao from "../../product/infrastructure/ProductDao";
import OrderDao from "../../order/infrastructure/OrderDao";
import CartDao from "../../cart/infrastructure/CartDao";
import AvatarDao from "../../avatar/infrastructure/AvatarDao";
import ReviewDao from "../../review/infrastructure/ReviewDao";
import PaymentInfoDao from "../../paymentInfo/infrastructure/PaymentInfoDao";
import ShippingInfoDao from "../../shippingInfo/infrastructure/ShippingInfoDao";
import { UserAttributes, UserRole } from "../domain/User";

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class UserDao extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
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

    public getProducts!: HasManyGetAssociationsMixin<ProductDao>;
    public addProducts!: HasManyAddAssociationMixin<ProductDao, number>;
    public hasProducts!: HasManyHasAssociationMixin<ProductDao, number>;
    public setProducts!: HasManySetAssociationsMixin<ProductDao, number>;
    public countProducts!: HasManyCountAssociationsMixin;

    public getOrders!: HasManyGetAssociationsMixin<OrderDao>;
    public addOrders!: HasManyAddAssociationMixin<OrderDao, number>;
    public hasOrders!: HasManyHasAssociationMixin<OrderDao, number>;
    public setOrders!: HasManySetAssociationsMixin<OrderDao, number>;
    public countOrders!: HasManyCountAssociationsMixin;

    public getCart!: HasOne<CartDao>;
    public setCart!: HasOneSetAssociationMixin<CartDao, number>;

    public getAvatar!: HasOne<AvatarDao>;
    public setAvatar!: HasOneSetAssociationMixin<AvatarDao, number>;

    public getReviews!: HasManyGetAssociationsMixin<ReviewDao>;
    public addReviews!: HasManyAddAssociationMixin<ReviewDao, number>;
    public hasReviews!: HasManyHasAssociationMixin<ReviewDao, number>;
    public setReviews!: HasManySetAssociationsMixin<ReviewDao, number>;
    public countReviews!: HasManyCountAssociationsMixin;

    public getPaymentsInfo!: HasManyGetAssociationsMixin<PaymentInfoDao>;
    public addPaymentsInfo!: HasManyAddAssociationMixin<PaymentInfoDao, number>;
    public hasPaymentsInfo!: HasManyHasAssociationMixin<PaymentInfoDao, number>;
    public setPaymentsInfo!: HasManySetAssociationsMixin<PaymentInfoDao, number>;
    public countPaymentsInfo!: HasManyCountAssociationsMixin;

    public getShippingsInfo!: HasManyGetAssociationsMixin<ShippingInfoDao>;
    public addShippingsInfo!: HasManyAddAssociationMixin<ShippingInfoDao, number>;
    public hasShippingsInfo!: HasManyHasAssociationMixin<ShippingInfoDao, number>;
    public setShippingsInfo!: HasManySetAssociationsMixin<ShippingInfoDao, number>;
    public countShippingsInfo!: HasManyCountAssociationsMixin;

    public readonly products?: Array<ProductDao>;
    public readonly orders?: Array<OrderDao>;
    public readonly cart?: CartDao;
    public readonly avatar?: AvatarDao;
    public readonly reviews?: Array<ReviewDao>;
    public readonly paymentsInfo?: Array<PaymentInfoDao>;
    public readonly shippingsInfo?: Array<ShippingInfoDao>;

    public static associations: {
        products: Association<UserDao, ProductDao>;
        orders: Association<UserDao, OrderDao>;
        cart: Association<UserDao, CartDao>;
        avatar: Association<UserDao, AvatarDao>;
        review: Association<UserDao, ReviewDao>;
        paymentsInfo: Association<UserDao, PaymentInfoDao>;
        shippingsInfo: Association<UserDao, ShippingInfoDao>;
    };
}

const init = (sequelize: Sequelize) => {
    UserDao.init(
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
export default UserDao;
