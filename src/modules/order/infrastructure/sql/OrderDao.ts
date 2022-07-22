import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasOneSetAssociationMixin,
    HasOneGetAssociationMixin,
    Sequelize,
} from "sequelize";

import OrderItemDao from "@orderItem/infrastructure/sql/OrderItemDao";
import PaymentInfoDao from "@paymentInfo/infrastructure/sql/PaymentInfoDao";
import ProductDao from "@product/infrastructure/sql/ProductDao";
import ShippingInfoDao from "@shippingInfo/infrastructure/sql/ShippingInfoDao";
import UserDao from "@user/infrastructure/sql/UserDao";
import { OrderStatus, validOrderStatus } from "@order/domain/Order";

const ORDER_TABLE = "orders";

interface OrderAttributes {
    readonly id: string;
    readonly itemsPrice: number;
    readonly taxPrice: number;
    readonly shippingPrice: number;
    readonly totalPrice: number;
    readonly orderStatus: OrderStatus;
    readonly deliveredAt?: Date | null;
    readonly paidAt?: Date | null;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class OrderDao extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: string;
    public itemsPrice!: number;
    public taxPrice!: number;
    public shippingPrice!: number;
    public totalPrice!: number;
    public orderStatus!: OrderStatus;
    public deliveredAt!: Date | null;
    public paidAt!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getProducts!: HasManyGetAssociationsMixin<ProductDao>;
    public addProducts!: HasManyAddAssociationMixin<ProductDao, number>;
    public hasProducts!: HasManyHasAssociationMixin<ProductDao, number>;
    public setProducts!: HasManySetAssociationsMixin<ProductDao, number>;

    public getOrderItems!: HasManyGetAssociationsMixin<OrderItemDao>;
    public addOrderItems!: HasManyAddAssociationMixin<OrderItemDao, number>;
    public hasOrderItems!: HasManyHasAssociationMixin<OrderItemDao, number>;
    public setOrderItems!: HasManySetAssociationsMixin<OrderItemDao, number>;
    public countOrderItems!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public getPaymentInfo!: HasOneGetAssociationMixin<PaymentInfoDao>;
    public setPaymentInfo!: HasOneSetAssociationMixin<PaymentInfoDao, number>;

    public getShippingInfo!: HasOneGetAssociationMixin<ShippingInfoDao>;
    public setShippingInfo!: HasOneSetAssociationMixin<ShippingInfoDao, number>;

    public readonly orderItems?: Array<OrderItemDao>;
    public readonly user?: UserDao;
    public readonly paymentInfo?: PaymentInfoDao;
    public readonly shippingInfo?: ShippingInfoDao;

    public static associations: {
        orderItems: Association<OrderDao, OrderItemDao>;
        user: Association<OrderDao, UserDao>;
        paymentInfo: Association<OrderDao, PaymentInfoDao>;
        shippingInfo: Association<OrderDao, ShippingInfoDao>;
    };
}

const init = (sequelize: Sequelize): void => {
    OrderDao.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            shippingPrice: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0,
            },
            totalPrice: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0,
            },
            orderStatus: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [validOrderStatus],
                },
            },
            deliveredAt: {
                type: DataTypes.DATE,
            },
            paidAt: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: ORDER_TABLE,
            sequelize,
        }
    );
};

export { init, ORDER_TABLE };
export default OrderDao;
