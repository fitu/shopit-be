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

import Order from "../../order/infrastructure/order";
import User from "../../user/infrastructure/user";
import { ShippingInfoAttributes } from "../domain/ShippingInfo";

interface ShippingInfoCreationAttributes extends Optional<ShippingInfoAttributes, "id"> {}

class ShippingInfo
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

    public getOrders!: HasManyGetAssociationsMixin<Order>;
    public addOrders!: HasManyAddAssociationMixin<Order, number>;
    public hasOrders!: HasManyHasAssociationMixin<Order, number>;
    public setOrders!: HasManySetAssociationsMixin<Order, number>;
    public countOrders!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<User>;
    public setUser!: HasOneSetAssociationMixin<User, number>;

    public readonly user?: User;
    public readonly orders?: Array<Order>;

    public static associations: {
        user: Association<ShippingInfo, User>;
        orders: Association<User, Order>;
    };
}

const init = (sequelize: Sequelize) => {
    ShippingInfo.init(
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
export default ShippingInfo;
