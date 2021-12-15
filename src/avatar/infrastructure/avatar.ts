import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Sequelize,
} from "sequelize";

import User from "../../user/infrastructure/user";
import { AvatarAttributes } from "../domain/Avatar";

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

const init = (sequelize: Sequelize) => {
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
};

export { init };
export default Avatar;
