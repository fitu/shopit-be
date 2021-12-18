import csv from "csv-parser";
import fs from "fs";

import Avatar from "../../avatar/domain/Avatar";
import Cart from "../../cart/domain/Cart";
import CartItem from "../../cartItem/domain/CartItem";
import Order from "../../order/domain/Order";
import OrderItem from "../../orderItem/domain/OrderItem";
import PaymentInfo from "../../paymentInfo/domain/PaymentInfo";
import PaymentOrder from "../../paymentOrder/domain/PaymentOrder";
import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import ShippingInfo from "../../shippingInfo/domain/ShippingInfo";
import User from "../../user/domain/User";
import CartRepository from "../../cart/infrastructure/CartRepository";
import ProductRepository from "../../product/infrastructure/ProductRepository";
import UserRepository from "../../user/infrastructure/UserRepository";
import validateEnv from "../../shared/env/envUtils";

import Db from "./SqlDb";

const AVATARS_CSV_PATH = "./src/avatar/infrastructure/data/avatars.csv";
const CARTS_CSV_PATH = "./src/cart/infrastructure/data/carts.csv";
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

        await Promise.all([
            createAvatars(),
            createCarts(cartRepository, userRepository),
            createCartItems(),
            createOrders(),
            createOrderItems(),
            createPaymentInfos(),
            createPaymentOrders(),
            createProducts(productRepository, userRepository),
            createReviews(),
            createShippingInfos(),
            createUsers(userRepository),
        ]);
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

    return new Promise((resolve) => {
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (data) => items.push(data))
            .on("end", async () => {
                resolve(items);
            });
    });
};

const createAvatars = async (): Promise<void> => {
    const avatars = await readFromCsv<Avatar>(AVATARS_CSV_PATH);
};

const createCarts = async (cartRepository: CartRepository, userRepository: UserRepository): Promise<void> => {
    const carts = await readFromCsv<Cart>(CARTS_CSV_PATH);

    await Promise.all(
        carts.map(async (cart) => {
            await cartRepository.save(cart);
            await userRepository.addCart(1, cart);
        })
    );
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

const createProducts = (productRepository: ProductRepository, userRepository: UserRepository): Promise<void> => {
    console.log("Create products");
    const products: Array<Product> = [];

    return new Promise(() => {
        fs.createReadStream(PRODUCTS_CSV_PATH)
            .pipe(csv())
            .on("data", (data) => products.push(data))
            .on("end", async () => {
                await Promise.all(
                    products.map(async (product) => {
                        // const newProduct = await productRepository.save(product);
                        // await userRepository.addProduct(1, newProduct.id);
                    })
                );
            });
    });
};

const createReviews = async (): Promise<void> => {
    const reviews = await readFromCsv<Review>(REVIEWS_CSV_PATH);
};

const createShippingInfos = async (): Promise<void> => {
    const shippingInfos = await readFromCsv<ShippingInfo>(SHIPPING_INFOS_CSV_PATH);
};

const createUsers = async (userRepository: UserRepository): Promise<void> => {
    const users = await readFromCsv<User>(USERS_CSV_PATH);

    await Promise.all(
        users.map(async (user) => {
            await userRepository.save(user);
        })
    );
};

seedProducts();
