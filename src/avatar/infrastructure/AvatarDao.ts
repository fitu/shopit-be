import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Sequelize,
} from "sequelize";

import UserDao from "../../user/infrastructure/UserDao";
import { AvatarAttributes } from "../domain/Avatar";

interface AvatarCreationAttributes extends Optional<AvatarAttributes, "id"> {}

class AvatarDao extends Model<AvatarAttributes, AvatarCreationAttributes> implements AvatarAttributes {
    public id!: number;
    public publicId!: string;
    public url!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public readonly user?: UserDao;

    public static associations: {
        user: Association<AvatarDao, UserDao>;
    };
}

const init = (sequelize: Sequelize) => {
    AvatarDao.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            publicId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isUrl: true,
                },
            },
        },
        {
            tableName: "avatar",
            sequelize,
        }
    );
};

export { init };
export default AvatarDao;
