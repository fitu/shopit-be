import { Model, DataTypes, Optional, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Sequelize } from "sequelize";

import ProductDao from "@product/infrastructure/sql/ProductDao";
import UserDao from "@user/infrastructure/sql/UserDao";
import Review from "@review/domain/Review";
import { fromReviewDaoToModel } from "@review/infrastructure/sql/reviewParsers";

const REVIEW_TABLE = "reviews";

interface ReviewAttributes {
    id: string;
    name: string;
    rating: number;
    comment: string;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id"> {}

class ReviewDao extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: string;
    public name!: string;
    public rating!: number;
    public comment!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly product?: ProductDao;
    public readonly user?: UserDao;

    public getProduct!: HasOneGetAssociationMixin<ProductDao>;
    public setProduct!: HasOneSetAssociationMixin<ProductDao, number>;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public toModel(): Review {
        return fromReviewDaoToModel(this);
    }
}

const init = (sequelize: Sequelize): void => {
    ReviewDao.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            tableName: REVIEW_TABLE,
            sequelize,
        }
    );
};

export { init, REVIEW_TABLE };
export default ReviewDao;
