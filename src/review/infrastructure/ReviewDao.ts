import {
    Model,
    DataTypes,
    Optional,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Association,
    Sequelize,
} from "sequelize";

import ProductDao from "../../product/infrastructure/ProductDao";
import UserDao from "../../user/infrastructure/UserDao";

interface ReviewAttributes {
    id: number;
    name: string;
    rating: number;
    comment: string;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id"> {}

class ReviewDao extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: number;
    public name!: string;
    public rating!: number;
    public comment!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getProduct!: HasOneGetAssociationMixin<ProductDao>;
    public setProduct!: HasOneSetAssociationMixin<ProductDao, number>;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public readonly product?: ProductDao;
    public readonly user?: UserDao;

    public static associations: {
        product: Association<ReviewDao, ProductDao>;
        user: Association<ReviewDao, UserDao>;
    };
}

const init = (sequelize: Sequelize) => {
    ReviewDao.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
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
export default ReviewDao;
