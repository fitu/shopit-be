import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../utils/database";

interface ShippingInfoAttributes {
    id: number;
    address: string;
    city: string;
    phone: string;
    postalCode: string;
    country: string;
}

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
}

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

export default ShippingInfo;
