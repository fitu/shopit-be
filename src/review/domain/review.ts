import {
    Model,
    DataTypes,
    Optional,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Association,
    Sequelize,
} from "sequelize";

import Product from "../../product/domain/product";
import User from "../../user/domain/user";

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

    public getProduct!: HasOneGetAssociationMixin<Product>;
    public setProduct!: HasOneSetAssociationMixin<Product, number>;

    public getUser!: HasOneGetAssociationMixin<User>;
    public setUser!: HasOneSetAssociationMixin<User, number>;

    public readonly product?: Product;
    public readonly user?: User;

    public static associations: {
        product: Association<Review, Product>;
        user: Association<Review, User>;
    };
}

const init = (sequelize: Sequelize) => {
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
};

export { init };
export default Review;
