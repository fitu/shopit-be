import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneSetAssociationMixin,
    HasOneGetAssociationMixin,
    Sequelize,
} from "sequelize";

import CartDao from "../../../cart/infrastructure/sql/CartDao";
import ProductDao from "../../../product/infrastructure/sql/ProductDao";

interface CartItemAttributes {
    id: number;
    quantity: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, "id"> {}

class CartItemDao extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getCart!: HasOneGetAssociationMixin<CartDao>;
    public setCart!: HasOneSetAssociationMixin<CartDao, number>;

    public getProduct!: HasOneGetAssociationMixin<ProductDao>;
    public setProduct!: HasOneSetAssociationMixin<ProductDao, number>;

    public readonly cart?: CartDao;
    public readonly product?: ProductDao;

    public static associations: {
        cart: Association<CartItemDao, CartDao>;
        product: Association<CartItemDao, ProductDao>;
    };
}

const init = (sequelize: Sequelize): void => {
    CartItemDao.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "cartItem",
            sequelize,
        }
    );
};

export { init };
export default CartItemDao;
