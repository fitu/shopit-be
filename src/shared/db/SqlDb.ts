import { Sequelize } from "sequelize";

import Product, { init as initProduct } from "../../product/infrastructure/product";
import User, { init as initUser } from "../../user/infrastructure/user";
import Cart, { init as initCart } from "../../cart/infrastructure/cart";
import UserRepository from "../../user/infrastructure/UserRepository";
import CartRepository from "../../cart/infrastructure/CartRepository";
import ProductRepository from "../../product/infrastructure/ProductRepository";
import CartItem, { init as initCartItem } from "../../cartItem/infrastructure/cartItem";
import Order, { init as initOrder } from "../../order/infrastructure/order";
import OrderItem, { init as initOrderItem } from "../../orderItem/infrastructure/orderItem";
import Avatar, { init as initAvatar } from "../../avatar/infrastructure/avatar";
import Review, { init as initReview } from "../../review/infrastructure/review";
import PaymentInfo, { init as initPaymentInfo } from "../../paymentInfo/infrastructure/paymentInfo";
import ShippingInfo, { init as initShippingInfo } from "../../shippingInfo/infrastructure/shippingInfo";

import Database, { DatabaseOptions } from "./Database";

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
        Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
        Product.belongsToMany(Cart, { through: CartItem });
        Product.hasMany(Review);

        Review.belongsTo(User);
        Review.belongsTo(Product);

        Cart.belongsTo(User);
        Cart.belongsToMany(Product, { through: CartItem });

        Order.belongsTo(User);
        Order.belongsToMany(Product, { through: OrderItem });
        Order.belongsTo(PaymentInfo);
        Order.belongsTo(ShippingInfo);

        User.hasMany(Product);
        User.hasOne(Cart);
        User.hasMany(Order);
        User.hasOne(Avatar);
        User.hasMany(Review);
        User.hasMany(PaymentInfo);
        User.hasMany(ShippingInfo);

        Avatar.belongsTo(User);

        PaymentInfo.belongsTo(User);
        PaymentInfo.hasMany(Order);

        ShippingInfo.belongsTo(User);
        ShippingInfo.hasMany(Order);
    };

    public clearDB = async (): Promise<void> => {
        console.log("Delete users");
        User.destroy({ where: {}, truncate: true });

        console.log("Delete carts");
        Cart.destroy({ where: {}, truncate: true });

        console.log("Delete products");
        Product.destroy({ where: {}, truncate: true });
    };

    public getUserRepository = (): UserRepository => {
        return new UserRepository();
    };

    public getCartRepository = (): CartRepository => {
        return new CartRepository();
    };

    public getProductRepository = (): ProductRepository => {
        return new ProductRepository();
    };
}

export default SqlDb;
