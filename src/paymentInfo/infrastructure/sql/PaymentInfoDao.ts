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

import OrderDao from "../../../order/infrastructure/sql/OrderDao";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import PaymentInfo, { PaymentStatus } from "../../domain/PaymentInfo";

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
                    // TODO: get from model
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
