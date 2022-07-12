import {
    Model,
    DataTypes,
    Optional,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyAddAssociationMixin,
    Sequelize,
} from "sequelize";

import OrderDao from "@order/infrastructure/sql/OrderDao";
import UserDao from "@user/infrastructure/sql/UserDao";
import ShippingInfo from "@shippingInfo/domain/ShippingInfo";

const SHIPPING_INFO_TABLE = 'shippingInfos';

interface ShippingInfoAttributes {
    id: string;
    address: string;
    city: string;
    phone: string;
    postalCode: string;
    country: string;
}

interface ShippingInfoCreationAttributes extends Optional<ShippingInfoAttributes, 'id'> {}

class ShippingInfoDao
    extends Model<ShippingInfoAttributes, ShippingInfoCreationAttributes>
    implements ShippingInfoAttributes
{
    public id!: string;
    public address!: string;
    public city!: string;
    public phone!: string;
    public postalCode!: string;
    public country!: string;

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

    public toModel(): ShippingInfo {
        return {
            id: this.id,
            address: this.address,
            city: this.city,
            phone: this.phone,
            postalCode: this.postalCode,
            country: this.country,
        };
    }
}

const init = (sequelize: Sequelize): void => {
    ShippingInfoDao.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            tableName: SHIPPING_INFO_TABLE,
            sequelize,
        }
    );
};

export { init };
export { SHIPPING_INFO_TABLE };
export default ShippingInfoDao;
