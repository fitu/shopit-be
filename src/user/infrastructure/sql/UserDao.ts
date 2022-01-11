import crypto from "crypto";
import {
    Model,
    DataTypes,
    Optional,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasOneSetAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    Sequelize,
    HasOneGetAssociationMixin,
} from "sequelize";

import ProductDao from "../../../product/infrastructure/sql/ProductDao";
import CartDao from "../../../cart/infrastructure/sql/CartDao";
import AvatarDao from "../../../avatar/infrastructure/sql/AvatarDao";
import ReviewDao from "../../../review/infrastructure/sql/ReviewDao";
import PaymentInfoDao from "../../../paymentInfo/infrastructure/sql/PaymentInfoDao";
import ShippingInfoDao from "../../../shippingInfo/infrastructure/sql/ShippingInfoDao";
import User, { UserRole } from "../../domain/User";

interface UserAttributes {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
    resetPasswordToken: string | null;
    resetPasswordExpire: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class UserDao extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public role!: UserRole;
    public password!: string;
    public resetPasswordToken!: string | null;
    public resetPasswordExpire!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly cart?: CartDao;
    public readonly avatar?: AvatarDao;
    public readonly paymentsInfo?: Array<PaymentInfoDao>;
    public readonly shippingsInfo?: Array<ShippingInfoDao>;
    public readonly products?: Array<ProductDao>;
    public readonly reviews?: Array<ReviewDao>;
    // public readonly orders?: Array<OrderDao>;

    public getProducts!: HasManyGetAssociationsMixin<ProductDao>;
    public addProducts!: HasManyAddAssociationMixin<ProductDao, number>;
    public hasProducts!: HasManyHasAssociationMixin<ProductDao, number>;
    public setProducts!: HasManySetAssociationsMixin<ProductDao, number>;
    public countProducts!: HasManyCountAssociationsMixin;

    public getReviews!: HasManyGetAssociationsMixin<ReviewDao>;
    public addReviews!: HasManyAddAssociationMixin<ReviewDao, number>;
    public hasReviews!: HasManyHasAssociationMixin<ReviewDao, number>;
    public setReviews!: HasManySetAssociationsMixin<ReviewDao, number>;
    public countReviews!: HasManyCountAssociationsMixin;

    // public getOrders!: HasManyGetAssociationsMixin<OrderDao>;
    // public addOrders!: HasManyAddAssociationMixin<OrderDao, number>;
    // public hasOrders!: HasManyHasAssociationMixin<OrderDao, number>;
    // public setOrders!: HasManySetAssociationsMixin<OrderDao, number>;

    // public countOrders!: HasManyCountAssociationsMixin;

    public getCart!: HasOneGetAssociationMixin<CartDao>;
    public setCart!: HasOneSetAssociationMixin<CartDao, number>;

    public getAvatar!: HasOneGetAssociationMixin<AvatarDao>;
    public setAvatar!: HasOneSetAssociationMixin<AvatarDao, number>;

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

    public toModel(): User {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
            password: this.password,
            resetPasswordToken: this.resetPasswordToken,
            resetPasswordExpire: this.resetPasswordExpire,
            cart: this.cart?.toModel(),
            avatar: this.avatar?.toModel(),
            products: this.products?.map((product) => product.toModel()),
            reviews: this.reviews?.map((review) => review.toModel()),
            shippingsInfo: this.shippingsInfo?.map((shippingsInfo) => shippingsInfo.toModel()),
        };
    }
}

const init = (sequelize: Sequelize): void => {
    UserDao.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
                    // TODO: get from model
                    isIn: [["user", "admin"]],
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    min: 8,
                },
                set(value: string) {
                    const hash = crypto.createHash("md5").update(value).digest("hex");
                    this.setDataValue("password", hash);
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
