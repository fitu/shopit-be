import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
} from "sequelize";

import sequelize from "../../shared/database";
import User from "../../user/domain/user";

interface AvatarAttributes {
    id: number;
    publicId: string;
    url: string;
}

interface AvatarCreationAttributes extends Optional<AvatarAttributes, "id"> {}

class Avatar extends Model<AvatarAttributes, AvatarCreationAttributes> implements AvatarAttributes {
    public id!: number;
    public publicId!: string;
    public url!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasOneGetAssociationMixin<User>;
    public setUser!: HasOneSetAssociationMixin<User, number>;

    public readonly user?: User;

    public static associations: {
        user: Association<Avatar, User>;
    };
}

Avatar.init(
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

export default Avatar;
