import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneSetAssociationMixin,
    HasOneGetAssociationMixin,
    Sequelize,
} from "sequelize";

import Cart from "../../cart/domain/cart";
import Product from "../../product/domain/product";

interface CartItemAttributes {
    id: number;
    quantity: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, "id"> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getCart!: HasOneGetAssociationMixin<Cart>;
    public setCart!: HasOneSetAssociationMixin<Cart, number>;

    public getProduct!: HasOneGetAssociationMixin<Product>;
    public setProduct!: HasOneSetAssociationMixin<Product, number>;

    public readonly cart?: Cart;
    public readonly product?: Product;

    public static associations: {
        cart: Association<CartItem, Cart>;
        product: Association<CartItem, Product>;
    };
}

const init = (sequelize: Sequelize) => {
    CartItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
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
export default CartItem;
