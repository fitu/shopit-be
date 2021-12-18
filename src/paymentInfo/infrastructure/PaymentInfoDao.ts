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

import OrderDao from "../../order/infrastructure/OrderDao";
import UserDao from "../../user/infrastructure/UserDao";
import { PaymentStatus } from "../domain/PaymentInfo";

interface PaymentInfoAttributes {
    id: number;
    status: PaymentStatus;
}

interface PaymentInfoCreationAttributes extends Optional<PaymentInfoAttributes, "id"> {}

class PaymentInfoDao
    extends Model<PaymentInfoAttributes, PaymentInfoCreationAttributes>
    implements PaymentInfoAttributes
{
    public id!: number;
    public status!: PaymentStatus;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public getOrders!: HasManyGetAssociationsMixin<OrderDao>;
    public addOrders!: HasManyAddAssociationMixin<OrderDao, number>;
    public hasOrders!: HasManyHasAssociationMixin<OrderDao, number>;
    public setOrders!: HasManySetAssociationsMixin<OrderDao, number>;
    public countOrders!: HasManyCountAssociationsMixin;

    public readonly user?: UserDao;
    public readonly orders?: Array<OrderDao>;

    public static associations: {
        user: Association<PaymentInfoDao, UserDao>;
        orders: Association<UserDao, OrderDao>;
    };
}

const init = (sequelize: Sequelize) => {
    PaymentInfoDao.init(
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
export default PaymentInfoDao;
