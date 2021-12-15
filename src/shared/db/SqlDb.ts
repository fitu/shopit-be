import { Sequelize } from "sequelize";

import ProductDao, { init as initProduct } from "../../product/infrastructure/ProductDao";
import UserDao, { init as initUser } from "../../user/infrastructure/UserDao";
import CartDao, { init as initCart } from "../../cart/infrastructure/CartDao";
import CartItemDao, { init as initCartItem } from "../../cartItem/infrastructure/CartItemDao";
import OrderDao, { init as initOrder } from "../../order/infrastructure/OrderDao";
import OrderItemDao, { init as initOrderItem } from "../../orderItem/infrastructure/OrderItemDao";
import AvatarDao, { init as initAvatar } from "../../avatar/infrastructure/AvatarDao";
import ReviewDao, { init as initReview } from "../../review/infrastructure/ReviewDao";
import PaymentInfoDao, { init as initPaymentInfo } from "../../paymentInfo/infrastructure/PaymentInfoDao";
import ShippingInfoDao, { init as initShippingInfo } from "../../shippingInfo/infrastructure/ShippingInfoDao";

import Database, { DatabaseOptions } from "./database";

class SqlDb implements Database {
    private env: any;
    private instance: Sequelize;

    constructor(env: any) {
        this.env = env;
    }

    public init = async (options?: DatabaseOptions): Promise<void> => {
        const db = this.createDB(this.env);
        this.instance = db;

        this.initializeTables();
        this.initializeRelationships();

        const forceSync = options?.force ?? false;
        await this.instance.sync({ force: forceSync });
    };

    private createDB = (env: any): Sequelize => {
        const dbName = env.DB_NAME;
        const dbUserName = env.DB_USER_NAME;
        const dbPassword = env.DB_PASSWORD;
        const dbHost = env.DB_HOST;
        const dbPort = env.DB_PORT;

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
        initShippingInfo(this.instance);
    };

    private initializeRelationships = (): void => {
        ProductDao.belongsTo(UserDao, { constraints: true, onDelete: "CASCADE" });
        ProductDao.belongsToMany(CartDao, { through: CartItemDao });
        ProductDao.hasMany(ReviewDao);

        ReviewDao.belongsTo(UserDao);
        ReviewDao.belongsTo(ProductDao);

        CartDao.belongsTo(UserDao);
        CartDao.belongsToMany(ProductDao, { through: CartItemDao });

        OrderDao.belongsTo(UserDao);
        OrderDao.belongsToMany(ProductDao, { through: OrderItemDao });
        OrderDao.belongsTo(PaymentInfoDao);
        OrderDao.belongsTo(ShippingInfoDao);

        UserDao.hasMany(ProductDao);
        UserDao.hasOne(CartDao);
        UserDao.hasMany(OrderDao);
        UserDao.hasOne(AvatarDao);
        UserDao.hasMany(ReviewDao);
        UserDao.hasMany(PaymentInfoDao);
        UserDao.hasMany(ShippingInfoDao);

        AvatarDao.belongsTo(UserDao);

        PaymentInfoDao.belongsTo(UserDao);
        PaymentInfoDao.hasMany(OrderDao);

        ShippingInfoDao.belongsTo(UserDao);
        ShippingInfoDao.hasMany(OrderDao);
    };

    public clearDB = async (): Promise<void> => {
        console.log("Delete users");
        UserDao.destroy({ where: {}, truncate: true });

        console.log("Delete carts");
        CartDao.destroy({ where: {}, truncate: true });

        console.log("Delete products");
        ProductDao.destroy({ where: {}, truncate: true });
    };

}

export default SqlDb;
