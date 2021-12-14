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

import OrderItem from "../../orderItem/domain/orderItem";
import PaymentInfo from "../../paymentInfo/domain/paymentInfo";
import Product from "../../product/domain/product";
import ShippingInfo from "../../shippingInfo/domain/shippingInfo";
import User from "../../user/domain/user";

type OrderStatus = "processing" | "shipped" | "delivered";

interface OrderAttributes {
    id: number;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: OrderStatus;
    deliveredAt: Date | null;
    paidAt: Date | null;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public itemsPrice!: number;
    public taxPrice!: number;
    public shippingPrice!: number;
    public totalPrice!: number;
    public orderStatus!: OrderStatus;
    public deliveredAt!: Date | null;
    public paidAt!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProducts!: HasManyAddAssociationMixin<Product, number>;
    public hasProducts!: HasManyHasAssociationMixin<Product, number>;
    public setProducts!: HasManySetAssociationsMixin<Product, number>;

    public getOrderItems!: HasManyGetAssociationsMixin<OrderItem>;
    public addOrderItems!: HasManyAddAssociationMixin<OrderItem, number>;
    public hasOrderItems!: HasManyHasAssociationMixin<OrderItem, number>;
    public setOrderItems!: HasManySetAssociationsMixin<OrderItem, number>;
    public countOrderItems!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<User>;
    public setUser!: HasOneSetAssociationMixin<User, number>;

    public getPaymentInfo!: HasOneGetAssociationMixin<PaymentInfo>;
    public setPaymentInfo!: HasOneSetAssociationMixin<PaymentInfo, number>;

    public getShippingInfo!: HasOneGetAssociationMixin<ShippingInfo>;
    public setShippingInfo!: HasOneSetAssociationMixin<ShippingInfo, number>;

    public readonly orderItems?: Array<OrderItem>;
    public readonly user?: User;
    public readonly paymentInfo?: PaymentInfo;
    public readonly shippingInfo?: ShippingInfo;

    public static associations: {
        orderItems: Association<Order, OrderItem>;
        user: Association<Order, User>;
        paymentInfo: Association<Order, PaymentInfo>;
        shippingInfo: Association<Order, ShippingInfo>;
    };
}

const init = (sequelize: Sequelize) => {
    Order.init(
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
                    isIn: [["processing", "shipped", "delivered"]],
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
            tableName: "order",
            sequelize,
        }
    );
};

export { init };
export default Order;
