import {
    Model,
    DataTypes,
    Optional,
    HasOneSetAssociationMixin,
    HasOneGetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    Sequelize,
} from "sequelize";

import OrderDao from "@order/infrastructure/sql/OrderDao";
import UserDao from "@user/infrastructure/sql/UserDao";
import PaymentInfo, { PaymentStatus, validPaymentStatus } from "@paymentInfo/domain/PaymentInfo";

const PAYMENT_INFO_TABLE = "paymentInfos";

interface PaymentInfoAttributes {
    id: string;
    status: PaymentStatus;
}

interface PaymentInfoCreationAttributes extends Optional<PaymentInfoAttributes, "id"> {}

class PaymentInfoDao
    extends Model<PaymentInfoAttributes, PaymentInfoCreationAttributes>
    implements PaymentInfoAttributes
{
    public id!: string;
    public status!: PaymentStatus;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly user?: UserDao;
    public readonly orders?: Array<OrderDao>;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    // TODO: check this
    public getOrders!: HasManyGetAssociationsMixin<OrderDao>;
    public addOrders!: HasManyAddAssociationMixin<OrderDao, number>;
    public hasOrders!: HasManyHasAssociationMixin<OrderDao, number>;
    public setOrders!: HasManySetAssociationsMixin<OrderDao, number>;
    public countOrders!: HasManyCountAssociationsMixin;

    public toModel(): PaymentInfo {
        return {
            id: this.id,
            status: this.status,
        };
    }
}

const init = (sequelize: Sequelize): void => {
    PaymentInfoDao.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [validPaymentStatus],
                },
            },
        },
        {
            tableName: PAYMENT_INFO_TABLE,
            sequelize,
        }
    );
};

export { init, PAYMENT_INFO_TABLE };
export default PaymentInfoDao;
