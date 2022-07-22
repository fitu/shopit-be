import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneSetAssociationMixin,
    HasOneGetAssociationMixin,
    Sequelize,
} from "sequelize";

import CartDao from "@cart/infrastructure/sql/CartDao";
import ProductDao from "@product/infrastructure/sql/ProductDao";

const CART_ITEM_TABLE = 'cartItems';

interface CartItemAttributes {
    readonly id: string;
    readonly quantity: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

class CartItemDao extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: string;
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
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: CART_ITEM_TABLE,
            sequelize,
        }
    );
};

export { init, CART_ITEM_TABLE };
export default CartItemDao;
