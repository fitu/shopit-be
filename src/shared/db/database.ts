import { Sequelize } from "sequelize";

import Product, { init as initProduct } from "../../product/domain/product";
import User, { init as initUser } from "../../user/domain/user";
import Cart, { init as initCart } from "../../cart/domain/cart";
import CartItem, { init as initCartItem } from "../../cartItem/domain/cartItem";
import Order, { init as initOrder } from "../../order/domain/order";
import OrderItem, { init as initOrderItem } from "../../orderItem/domain/orderItem";
import Avatar, { init as initAvatar } from "../../avatar/domain/avatar";
import Review, { init as initReview } from "../../review/domain/review";
import PaymentInfo, { init as initPaymentInfo } from "../../paymentInfo/domain/paymentInfo";
import ShippingInfo, { init as initShippingInfo } from "../../shippingInfo/domain/shippingInfo";

const initializeDB = async (env: any, { force = false } = {}): Promise<void> => {
    const db = createDB(env);
    initializeTables(db);
    initializeRelationships();

    await db.sync({ force });
};

const createDB = (env: any) => {
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

const initializeTables = (db: Sequelize): void => {
    initProduct(db);
    initUser(db);
    initCart(db);
    initCartItem(db);
    initOrder(db);
    initOrderItem(db);
    initAvatar(db);
    initReview(db);
    initPaymentInfo(db);
    initShippingInfo(db);
};

const initializeRelationships = (): void => {
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

export { initializeDB };
