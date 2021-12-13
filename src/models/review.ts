import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../utils/database";

interface ReviewAttributes {
    id: number;
    name: string;
    rating: number;
    comment: string;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id"> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: number;
    public name!: string;
    public rating!: number;
    public comment!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "review",
        sequelize,
    }
);

export default Review;
