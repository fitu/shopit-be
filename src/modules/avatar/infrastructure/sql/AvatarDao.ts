import { Model, DataTypes, Optional, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Sequelize } from "sequelize";

import Avatar from "@avatar/domain/Avatar";
import UserDao from "@user/infrastructure/sql/UserDao";
import { fromAvatarDaoToModel } from "@avatar/infrastructure/sql/avatarParsers";

const AVATAR_TABLE = "avatars";

interface AvatarAttributes {
    readonly id: string;
    readonly publicId: string;
    readonly url: string;
}

interface AvatarCreationAttributes extends Optional<AvatarAttributes, "id"> {}

class AvatarDao extends Model<AvatarAttributes, AvatarCreationAttributes> implements AvatarAttributes {
    public id!: string;
    public publicId!: string;
    public url!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public toModel(): Avatar {
        return fromAvatarDaoToModel(this);
    }
}

const init = (sequelize: Sequelize): void => {
    AvatarDao.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            tableName: AVATAR_TABLE,
            sequelize,
        }
    );
};

export { init, AVATAR_TABLE };
export default AvatarDao;
