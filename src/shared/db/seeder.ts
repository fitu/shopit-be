import csv from "csv-parser";
import fs from "fs";

import CartItem from "../../cartItem/domain/CartItem";
import Order from "../../order/domain/Order";
import OrderItem from "../../orderItem/domain/OrderItem";
import PaymentInfo from "../../paymentInfo/domain/PaymentInfo";
import PaymentOrder from "../../paymentOrder/domain/PaymentOrder";
import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import ShippingInfo from "../../shippingInfo/domain/ShippingInfo";
import UserCSV from "../../user/infrastructure/data/UserCSV";
import CartRepository from "../../cart/infrastructure/CartRepository";
import CartService from "../../cart/domain/CartService";
import ProductRepository from "../../product/infrastructure/ProductRepository";
import UserRepository from "../../user/infrastructure/UserRepository";
import UserService from "../../user/domain/UserService";
import validateEnv from "../../shared/env/envUtils";

import Db from "./SqlDb";

const CART_ITEMS_CSV_PATH = "./src/cartItem/infrastructure/data/cartItems.csv";
const ORDERS_CSV_PATH = "./src/order/infrastructure/data/orders.csv";
const ORDER_ITEMS_CSV_PATH = "./src/orderItem/infrastructure/data/orderItems.csv";
const PAYMENT_INFOS_CSV_PATH = "./src/paymentInfo/infrastructure/data/paymentInfos.csv";
const PAYMENT_ORDERS_CSV_PATH = "./src/paymentOrder/infrastructure/data/paymentOrders.csv";
const PRODUCTS_CSV_PATH = "./src/product/infrastructure/data/products.csv";
const REVIEWS_CSV_PATH = "./src/review/infrastructure/data/reviews.csv";
const SHIPPING_INFOS_CSV_PATH = "./src/shippingInfo/infrastructure/data/shippingInfos.csv";
const USERS_CSV_PATH = "./src/user/infrastructure/data/users.csv";

const seedProducts = async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize the DB
        const db = new Db(env);
        await db.init({ force: true });

        await db.clearDB();

        const userRepository = new UserRepository();
        const cartRepository = new CartRepository();
        const productRepository = new ProductRepository();

        const cartService = new CartService(cartRepository);
        const userService = new UserService(userRepository);

        await createUsers(userService);
        // createCartItems(),
        // createOrders(),
        // createOrderItems(),
        // createPaymentInfos(),
        // createPaymentOrders(),
        // createProducts(productRepository, userRepository),
        // createReviews(),
        // createShippingInfos(),
    } catch (error) {
        console.error(`There was an error populating the db: ${error}`);
    } finally {
        console.log("DB fulfilled!");
        process.exit();
    }
};

const readFromCsv = async <T>(csvPath: string): Promise<Array<T>> => {
    console.log(`Loading file: ${csvPath}`);
    const items: Array<T> = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (data) => items.push(data))
            .on("end", async () => {
                resolve(items);
            });
    });
};

const createUsers = async (userService: UserService): Promise<void> => {
    const usersCSV = await readFromCsv<UserCSV>(USERS_CSV_PATH);
    const users = usersCSV.map((userCSV) => UserCSV.toModel(userCSV));
    await userService.createBulk(users);
};

const createCartItems = async (): Promise<void> => {
    const cartItems = await readFromCsv<CartItem>(CART_ITEMS_CSV_PATH);
};

const createOrders = async (): Promise<void> => {
    const orders = await readFromCsv<Order>(ORDERS_CSV_PATH);
};

const createOrderItems = async (): Promise<void> => {
    const orderItems = await readFromCsv<OrderItem>(ORDER_ITEMS_CSV_PATH);
};

const createPaymentInfos = async (): Promise<void> => {
    const paymentInfos = await readFromCsv<PaymentInfo>(PAYMENT_INFOS_CSV_PATH);
};

const createPaymentOrders = async (): Promise<void> => {
    const paymentOrders = await readFromCsv<PaymentOrder>(PAYMENT_ORDERS_CSV_PATH);
};

const createProducts = async (productRepository: ProductRepository, userRepository: UserRepository): Promise<void> => {
    const products = await readFromCsv<Product>(PRODUCTS_CSV_PATH);
};

const createReviews = async (): Promise<void> => {
    const reviews = await readFromCsv<Review>(REVIEWS_CSV_PATH);
};

const createShippingInfos = async (): Promise<void> => {
    const shippingInfos = await readFromCsv<ShippingInfo>(SHIPPING_INFOS_CSV_PATH);
};

seedProducts();
