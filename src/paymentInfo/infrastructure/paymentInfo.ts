import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneSetAssociationMixin,
    HasOneGetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    Sequelize,
} from "sequelize";

import Order from "../../order/infrastructure/order";
import User from "../../user/infrastructure/user";
import { PaymentInfoAttributes, PaymentStatus } from "../domain/PaymentInfo";

interface PaymentInfoCreationAttributes extends Optional<PaymentInfoAttributes, "id"> {}

class PaymentInfo extends Model<PaymentInfoAttributes, PaymentInfoCreationAttributes> implements PaymentInfoAttributes {
    public id!: number;
    public status!: PaymentStatus;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasOneGetAssociationMixin<User>;
    public setUser!: HasOneSetAssociationMixin<User, number>;

    public getOrders!: HasManyGetAssociationsMixin<Order>;
    public addOrders!: HasManyAddAssociationMixin<Order, number>;
    public hasOrders!: HasManyHasAssociationMixin<Order, number>;
    public setOrders!: HasManySetAssociationsMixin<Order, number>;
    public countOrders!: HasManyCountAssociationsMixin;

    public readonly user?: User;
    public readonly orders?: Array<Order>;

    public static associations: {
        user: Association<PaymentInfo, User>;
        orders: Association<User, Order>;
    };
}

const init = (sequelize: Sequelize) => {
    PaymentInfo.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["not-paid", "paid"]],
                },
            },
        },
        {
            tableName: "paymentInfo",
            sequelize,
        }
    );
};

export { init };
export default PaymentInfo;
