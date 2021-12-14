import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Sequelize,
} from "sequelize";

import Order from "../../order/domain/order";
import Product from "../../product/domain/product";

interface OrderItemAttributes {
    id: number;
    quantity: number;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id"> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getOrder!: HasOneGetAssociationMixin<Order>;
    public setOrder!: HasOneSetAssociationMixin<Order, number>;

    public getProduct!: HasOneGetAssociationMixin<Product>;
    public setProduct!: HasOneSetAssociationMixin<Product, number>;

    public readonly order?: Order;
    public readonly product?: Product;

    public static associations: {
        order: Association<OrderItem, Order>;
        product: Association<OrderItem, Product>;
    };
}

const init = (sequelize: Sequelize) => {
    OrderItem.init(
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
            tableName: "orderItem",
            sequelize,
        }
    );
};

export { init };
export default OrderItem;
