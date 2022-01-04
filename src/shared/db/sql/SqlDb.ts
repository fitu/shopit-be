import { Sequelize } from "sequelize";

import ProductDao, { init as initProduct } from "../../../product/infrastructure/sql/ProductDao";
import UserDao, { init as initUser } from "../../../user/infrastructure/sql/UserDao";
import CartDao, { init as initCart } from "../../../cart/infrastructure/sql/CartDao";
import CartItemDao, { init as initCartItem } from "../../../cartItem/infrastructure/sql/CartItemDao";
import OrderDao, { init as initOrder } from "../../../order/infrastructure/sql/OrderDao";
import OrderItemDao, { init as initOrderItem } from "../../../orderItem/infrastructure/sql/OrderItemDao";
import AvatarDao, { init as initAvatar } from "../../../avatar/infrastructure/sql/AvatarDao";
import ReviewDao, { init as initReview } from "../../../review/infrastructure/sql/ReviewDao";
import PaymentOrderDao, { init as initPaymentOrder } from "../../../paymentOrder/infrastructure/sql/PaymentOrderDao";
import PaymentInfoDao, { init as initPaymentInfo } from "../../../paymentInfo/infrastructure/sql/PaymentInfoDao";
import ShippingInfoDao, { init as initShippingInfo } from "../../../shippingInfo/infrastructure/sql/ShippingInfoDao";

import Database, { DatabaseOptions } from "../database";

class SqlDb implements Database {
    private env: any;
    private instance: Sequelize;

    constructor(env: any) {
        this.env = env;
    }

    public init = async (options?: DatabaseOptions): Promise<void> => {
        const db = this.createDbConnection();
        this.instance = db;

        this.initializeTables();
        this.initializeRelationships();

        const forceSync = options?.force ?? false;
        await this.instance.sync({ force: forceSync });
    };

    private createDbConnection = (): Sequelize => {
        const dbName = this.env.DB_SQL_NAME;
        const dbUserName = this.env.DB_SQL_USER_NAME;
        const dbPassword = this.env.DB_SQL_PASSWORD;
        const dbHost = this.env.DB_SQL_HOST;
        const dbPort = this.env.DB_SQL_PORT;

        return new Sequelize(dbName, dbUserName, dbPassword, {
            dialect: "postgres",
            host: dbHost,
            port: dbPort,
        });
    };

    private initializeTables = (): void => {
        initProduct(this.instance);
        initUser(this.instance);
        initCart(this.instance);
        initCartItem(this.instance);
        initOrder(this.instance);
        initOrderItem(this.instance);
        initAvatar(this.instance);
        initReview(this.instance);
        initPaymentInfo(this.instance);
        initPaymentOrder(this.instance);
        initShippingInfo(this.instance);
    };

    private initializeRelationships = (): void => {
        AvatarDao.belongsTo(UserDao, { targetKey: "id", foreignKey: "userId", as: "user" });

        CartDao.belongsTo(UserDao, { targetKey: "id", foreignKey: "userId", as: "user" });
        CartDao.belongsToMany(ProductDao, { through: CartItemDao, targetKey: "id", foreignKey: "cartId" });

        OrderDao.belongsTo(UserDao, { targetKey: "id", foreignKey: "userId" });
        OrderDao.belongsTo(PaymentInfoDao, { targetKey: "id", foreignKey: "paymentInfoId" });
        OrderDao.belongsTo(ShippingInfoDao, { targetKey: "id", foreignKey: "shippingInfoId" });
        OrderDao.belongsToMany(ProductDao, { through: OrderItemDao, targetKey: "id", foreignKey: "orderId" });
        OrderDao.belongsToMany(PaymentInfoDao, { through: PaymentOrderDao, targetKey: "id", foreignKey: "orderId" });

        PaymentInfoDao.hasMany(OrderDao, { sourceKey: "id", foreignKey: "paymentInfoId" });
        PaymentInfoDao.belongsTo(UserDao, { targetKey: "id", foreignKey: "userId", as: "user" });
        PaymentInfoDao.belongsToMany(OrderDao, {
            through: PaymentOrderDao,
            targetKey: "id",
            foreignKey: "paymentInfoId",
        });

        ProductDao.hasMany(ReviewDao, { sourceKey: "id", foreignKey: "productId", as: "reviews" });
        ProductDao.belongsTo(UserDao, { targetKey: "id", foreignKey: "userId", as: "user" });
        ProductDao.belongsToMany(CartDao, { through: CartItemDao, targetKey: "id", foreignKey: "productId" });
        ProductDao.belongsToMany(OrderDao, { through: OrderItemDao, targetKey: "id", foreignKey: "productId" });

        ReviewDao.belongsTo(UserDao, { targetKey: "id", foreignKey: "userId", as: "user" });
        ReviewDao.belongsTo(ProductDao, { targetKey: "id", foreignKey: "productId", as: "product" });

        ShippingInfoDao.hasMany(OrderDao, { sourceKey: "id", foreignKey: "shippingInfoId" });
        ShippingInfoDao.belongsTo(UserDao, { targetKey: "id", foreignKey: "userId", as: "user" });

        UserDao.hasOne(CartDao, {
            sourceKey: "id",
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            as: "cart",
        });
        UserDao.hasOne(AvatarDao, { sourceKey: "id", foreignKey: "userId", as: "avatar" });
        UserDao.hasMany(ProductDao, { sourceKey: "id", foreignKey: "userId", as: "products" });
        UserDao.hasMany(OrderDao, { sourceKey: "id", foreignKey: "userId" });
        UserDao.hasMany(ReviewDao, { sourceKey: "id", foreignKey: "userId", as: "reviews" });
        UserDao.hasMany(PaymentInfoDao, { sourceKey: "id", foreignKey: "userId", as: "paymentsInfo" });
        UserDao.hasMany(ShippingInfoDao, { sourceKey: "id", foreignKey: "userId", as: "shippingsInfo" });
    };

    // TODO: check this
    public clearDB = async (): Promise<void> => {
        console.log("Delete users");
        await UserDao.destroy({ where: {} });

        console.log("Delete carts");
        await CartDao.destroy({ where: {} });

        console.log("Delete avatars");
        await AvatarDao.destroy({ where: {} });

        console.log("Delete payment infos");
        await PaymentInfoDao.destroy({ where: {} });

        console.log("Delete shipping infos");
        await ShippingInfoDao.destroy({ where: {} });

        console.log("Delete products");
        await ProductDao.destroy({ where: {} });

        console.log("Delete reviews");
        await ReviewDao.destroy({ where: {} });
    };
}

export default SqlDb;
