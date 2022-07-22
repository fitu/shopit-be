import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Sequelize,
} from "sequelize";

import OrderDao from "@order/infrastructure/sql/OrderDao";
import ProductDao from "@product/infrastructure/sql/ProductDao";

const ORDER_ITEM_TABLE = 'orderItems';

interface OrderItemAttributes {
    readonly id: string;
    readonly quantity: number;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

class OrderItemDao extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: string;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getOrder!: HasOneGetAssociationMixin<OrderDao>;
    public setOrder!: HasOneSetAssociationMixin<OrderDao, number>;

    public getProduct!: HasOneGetAssociationMixin<ProductDao>;
    public setProduct!: HasOneSetAssociationMixin<ProductDao, number>;

    public readonly order?: OrderDao;
    public readonly product?: ProductDao;

    public static associations: {
        order: Association<OrderItemDao, OrderDao>;
        product: Association<OrderItemDao, ProductDao>;
    };
}

const init = (sequelize: Sequelize): void => {
    OrderItemDao.init(
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
            tableName: ORDER_ITEM_TABLE,
            sequelize,
        }
    );
};

export { init, ORDER_ITEM_TABLE };
export default OrderItemDao;
