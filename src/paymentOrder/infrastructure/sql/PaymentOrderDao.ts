import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Sequelize,
} from "sequelize";

import OrderDao from "../../../order/infrastructure/sql/OrderDao";
import PaymentInfoDao from "../../../paymentInfo/infrastructure/sql/PaymentInfoDao";

interface PaymentOrderAttributes {
    id: number;
    amount: number;
}

interface OrderItemCreationAttributes extends Optional<PaymentOrderAttributes, "id"> {}

class PaymentOrderDao
    extends Model<PaymentOrderAttributes, OrderItemCreationAttributes>
    implements PaymentOrderAttributes
{
    public id!: number;
    public amount!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getOrder!: HasOneGetAssociationMixin<OrderDao>;
    public setOrder!: HasOneSetAssociationMixin<OrderDao, number>;

    public getPaymentInfo!: HasOneGetAssociationMixin<PaymentInfoDao>;
    public setPaymentInfo!: HasOneSetAssociationMixin<PaymentInfoDao, number>;

    public readonly order?: OrderDao;
    public readonly paymentInfo?: PaymentInfoDao;

    public static associations: {
        order: Association<PaymentOrderDao, OrderDao>;
        paymentInfo: Association<PaymentOrderDao, PaymentInfoDao>;
    };
}

const init = (sequelize: Sequelize) => {
    PaymentOrderDao.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "paymentOrder",
            sequelize,
        }
    );
};

export { init };
export default PaymentOrderDao;
