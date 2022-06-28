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
import { hashPasswordSync } from "../../../shared/utils/hashUtils";
import Cart from "../../../cart/domain/Cart";
import Avatar from "../../../avatar/domain/Avatar";

import { fromUserDaoToModel } from "./userParsers";

const USER_TABLE = "users";
const USER_ID = "id";
const USER_FIRST_NAME = "firstName";
const USER_LAST_NAME = "lastName";
const USER_EMAIL = "email";
const USER_ROLE = "role";
const USER_PASSWORD = "password";
const USER_RESET_PASSWORD_TOKEN = "resetPasswordToken";
const USER_RESET_PASSWORD_EXPIRATION_DATE = "resetPasswordExpirationDate";
const USER_CREATED_AT = "createdAt";
const USER_UPDATED_AT = "updatedAt";
const USER_CART = "cart";
const USER_AVATAR = "avatar";
const USER_PAYMENTS_INFO = "paymentsInfo";
const USER_SHIPPINGS_INFO = "shippingsInfo";
const USER_PRODUCTS = "products";
const USER_REVIEWS = "reviews";
const USER_ORDERS = "orders";

interface UserAttributes {
    [USER_ID]: string;
    [USER_FIRST_NAME]: string;
    [USER_LAST_NAME]: string;
    [USER_EMAIL]: string;
    [USER_ROLE]: UserRole;
    [USER_PASSWORD]: string;
    [USER_RESET_PASSWORD_TOKEN]?: string | null;
    [USER_RESET_PASSWORD_EXPIRATION_DATE]?: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class UserDao extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public [USER_ID]!: string;
    public [USER_FIRST_NAME]!: string;
    public [USER_LAST_NAME]!: string;
    public [USER_EMAIL]!: string;
    public [USER_ROLE]!: UserRole;
    public [USER_PASSWORD]!: string;
    public [USER_RESET_PASSWORD_TOKEN]!: string | null;
    public [USER_RESET_PASSWORD_EXPIRATION_DATE]!: Date | null;

    public readonly [USER_CREATED_AT]!: Date;
    public readonly [USER_UPDATED_AT]!: Date;

    public readonly [USER_CART]?: CartDao;
    public readonly [USER_AVATAR]?: AvatarDao;
    public readonly [USER_PAYMENTS_INFO]?: Array<PaymentInfoDao>;
    public readonly [USER_SHIPPINGS_INFO]?: Array<ShippingInfoDao>;
    public readonly [USER_PRODUCTS]?: Array<ProductDao>;
    public readonly [USER_REVIEWS]?: Array<ReviewDao>;
    // public readonly [USER_ORDERS]?: Array<OrderDao>;

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
        return fromUserDaoToModel(this);
    }
}

const init = (sequelize: Sequelize): void => {
    UserDao.init(
        {
            [USER_ID]: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            [USER_FIRST_NAME]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 30],
                },
            },
            [USER_LAST_NAME]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 30],
                },
            },
            [USER_EMAIL]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
                unique: true,
            },
            [USER_ROLE]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    // TODO: get from model
                    isIn: [["user", "admin"]],
                },
            },
            [USER_PASSWORD]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    min: 8,
                },
                set(value: string) {
                    const hash = hashPasswordSync(value);
                    this.setDataValue(USER_PASSWORD, hash);
                },
            },
            [USER_RESET_PASSWORD_TOKEN]: {
                type: DataTypes.STRING,
            },
            [USER_RESET_PASSWORD_EXPIRATION_DATE]: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: USER_TABLE,
            sequelize,
        }
    );
};

const validateUserFieldsToInsert = (user: User): User => {
    const cart = new Cart({
        id: user.cart.id,
        itemsPrice: user.cart.itemsPrice,
        taxPrice: user.cart.taxPrice,
        totalPrice: user.cart.totalPrice,
    });

    const avatar = user.avatar
        ? new Avatar({
              id: user.avatar.id,
              publicId: user.avatar.publicId,
              url: user.avatar.url,
          })
        : null;

    // TODO: check this ...()
    const validatedUser = new User({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        password: user.password,
        resetPasswordToken: user?.resetPasswordToken,
        resetPasswordExpirationDate: user.resetPasswordExpirationDate
            ? new Date(user.resetPasswordExpirationDate)
            : null,
        cart,
        avatar,
    });

    return validatedUser;
};

export {
    init,
    validateUserFieldsToInsert,
    USER_TABLE,
    USER_ID,
    USER_FIRST_NAME,
    USER_LAST_NAME,
    USER_EMAIL,
    USER_ROLE,
    USER_PASSWORD,
    USER_RESET_PASSWORD_TOKEN,
    USER_RESET_PASSWORD_EXPIRATION_DATE,
    USER_CREATED_AT,
    USER_UPDATED_AT,
    USER_CART,
    USER_AVATAR,
    USER_PAYMENTS_INFO,
    USER_SHIPPINGS_INFO,
    USER_PRODUCTS,
    USER_REVIEWS,
    USER_ORDERS,
};
export default UserDao;
