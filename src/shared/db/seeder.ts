import csv from "csv-parser";
import fs from "fs";

import PaymentInfo from "../../paymentInfo/domain/PaymentInfo";
import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import ShippingInfo from "../../shippingInfo/domain/ShippingInfo";
import UserCSV from "../../user/infrastructure/data/UserCSV";
import ProductRepository from "../../product/infrastructure/ProductRepository";
import UserRepository from "../../user/infrastructure/UserRepository";
import PaymentInfoRepository from "../../paymentInfo/infrastructure/PaymentInfoRepository";
import ShippingInfoRepository from "../../shippingInfo/infrastructure/ShippingInfoRepository";
import ReviewRepository from "../../review/infrastructure/ReviewRepository";
import UserService from "../../user/domain/UserService";
import PaymentInfoService from "../../paymentInfo/domain/PaymentInfoService";
import ShippingInfoService from "../../shippingInfo/domain/ShippingInfoService";
import ProductService from "../../product/domain/ProductService";
import ReviewService from "../../review/domain/ReviewService";
import validateEnv from "../../shared/env/envUtils";

import Db from "./SqlDb";

const PAYMENT_INFOS_CSV_PATH = "./src/paymentInfo/infrastructure/data/paymentInfos.csv";
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
        const paymentInfoRepository = new PaymentInfoRepository();
        const shippingInfoRepository = new ShippingInfoRepository();
        const productRepository = new ProductRepository();
        const reviewRepository = new ReviewRepository();

        const userService = new UserService(userRepository);
        const paymentInfoService = new PaymentInfoService(paymentInfoRepository);
        const shippingInfoService = new ShippingInfoService(shippingInfoRepository);
        const productService = new ProductService(productRepository, userRepository);
        const reviewService = new ReviewService(reviewRepository);

        await createUsers(userService);
        await createPaymentInfos(paymentInfoService);
        await createShippingInfos(shippingInfoService);
        await createProducts(productService);
        await createReviews(reviewService);
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

const createPaymentInfos = async (paymentInfoService: PaymentInfoService): Promise<void> => {
    const paymentInfos = await readFromCsv<PaymentInfo>(PAYMENT_INFOS_CSV_PATH);
};

const createShippingInfos = async (shippingInfoService: ShippingInfoService): Promise<void> => {
    const shippingInfos = await readFromCsv<ShippingInfo>(SHIPPING_INFOS_CSV_PATH);
};

const createProducts = async (productService: ProductService): Promise<void> => {
    const products = await readFromCsv<Product>(PRODUCTS_CSV_PATH);
};

const createReviews = async (reviewService: ReviewService): Promise<void> => {
    const reviews = await readFromCsv<Review>(REVIEWS_CSV_PATH);
};

seedProducts();
