import { Model, DataTypes, Optional, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Sequelize } from "sequelize";

import Avatar from "../domain/Avatar";
import UserDao from "../../user/infrastructure/UserDao";

interface AvatarAttributes {
    id: number;
    publicId: string;
    url: string;
}

interface AvatarCreationAttributes extends Optional<AvatarAttributes, "id"> {}

class AvatarDao extends Model<AvatarAttributes, AvatarCreationAttributes> implements AvatarAttributes {
    public id!: number;
    public publicId!: string;
    public url!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public toModel(): Avatar {
        return {
            id: this.id,
            publicId: this.publicId,
            url: this.url,
        };
    }
}

const init = (sequelize: Sequelize) => {
    AvatarDao.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
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
