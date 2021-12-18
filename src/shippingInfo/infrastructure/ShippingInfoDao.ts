import {
    Model,
    DataTypes,
    Optional,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Association,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyAddAssociationMixin,
    Sequelize,
} from "sequelize";

import OrderDao from "../../order/infrastructure/OrderDao";
import UserDao from "../../user/infrastructure/UserDao";

interface ShippingInfoAttributes {
    id: number;
    address: string;
    city: string;
    phone: string;
    postalCode: string;
    country: string;
}

interface ShippingInfoCreationAttributes extends Optional<ShippingInfoAttributes, "id"> {}

class ShippingInfoDao
    extends Model<ShippingInfoAttributes, ShippingInfoCreationAttributes>
    implements ShippingInfoAttributes
{
    public id!: number;
    public address!: string;
    public city!: string;
    public phone!: string;
    public postalCode!: string;
    public country!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getOrders!: HasManyGetAssociationsMixin<OrderDao>;
    public addOrders!: HasManyAddAssociationMixin<OrderDao, number>;
    public hasOrders!: HasManyHasAssociationMixin<OrderDao, number>;
    public setOrders!: HasManySetAssociationsMixin<OrderDao, number>;
    public countOrders!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public readonly user?: UserDao;
    public readonly orders?: Array<OrderDao>;

    public static associations: {
        user: Association<ShippingInfoDao, UserDao>;
        orders: Association<UserDao, OrderDao>;
    };
}

const init = (sequelize: Sequelize) => {
    ShippingInfoDao.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            postalCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "shippingInfo",
            sequelize,
        }
    );
};

export { init };
export default ShippingInfoDao;
