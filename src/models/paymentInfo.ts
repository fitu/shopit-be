import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../utils/database";

type Status = "not-paid" | "paid";

interface PaymentInfoAttributes {
    id: number;
    status: Status;
}

interface PaymentInfoCreationAttributes extends Optional<PaymentInfoAttributes, "id"> {}

class PaymentInfo extends Model<PaymentInfoAttributes, PaymentInfoCreationAttributes> implements PaymentInfoAttributes {
    public id!: number;
    public status!: Status;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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

export default PaymentInfo;
