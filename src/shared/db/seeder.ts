import csv from "csv-parser";
import fs from "fs";

import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import ShippingInfo from "../../shippingInfo/domain/ShippingInfo";
import UserCSV from "../../user/infrastructure/data/UserCSV";
import ProductRepository from "../../product/infrastructure/ProductRepository";
import UserRepository from "../../user/infrastructure/UserRepository";
import ShippingInfoRepository from "../../shippingInfo/infrastructure/ShippingInfoRepository";
import ReviewRepository from "../../review/infrastructure/ReviewRepository";
import UserService from "../../user/domain/UserService";
import ShippingInfoService from "../../shippingInfo/domain/ShippingInfoService";
import ProductService from "../../product/domain/ProductService";
import ReviewService from "../../review/domain/ReviewService";
import ShippingInfoCSV from "../../shippingInfo/infrastructure/data/ShippingInfoCSV";
import validateEnv from "../../shared/env/envUtils";

import Db from "./SqlDb";

const PRODUCTS_CSV_PATH = "./src/product/infrastructure/data/products.csv";
const REVIEWS_CSV_PATH = "./src/review/infrastructure/data/reviews.csv";
const SHIPPINGS_INFO_CSV_PATH = "./src/shippingInfo/infrastructure/data/shippingsInfo.csv";
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
        const shippingInfoRepository = new ShippingInfoRepository();
        const productRepository = new ProductRepository();
        const reviewRepository = new ReviewRepository();

        const userService = new UserService(userRepository);
        const shippingInfoService = new ShippingInfoService(shippingInfoRepository);
        const productService = new ProductService(productRepository, userRepository);
        const reviewService = new ReviewService(reviewRepository);

        await createUsers(userService);
        await createShippingsInfo(shippingInfoService);
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

const createShippingsInfo = async (shippingInfoService: ShippingInfoService): Promise<void> => {
    const shippingsInfoCSV = await readFromCsv<ShippingInfoCSV>(SHIPPINGS_INFO_CSV_PATH);
    const shippingsInfo = shippingsInfoCSV.map((shippingInfoCSV) => ShippingInfoCSV.toModel(shippingInfoCSV));
    const userIds = shippingsInfoCSV.map((shippingInfoCSV) => shippingInfoCSV.userId);
    await shippingInfoService.createBulk(shippingsInfo, userIds);
};

const createProducts = async (productService: ProductService): Promise<void> => {
    const products = await readFromCsv<Product>(PRODUCTS_CSV_PATH);
};

const createReviews = async (reviewService: ReviewService): Promise<void> => {
    const reviews = await readFromCsv<Review>(REVIEWS_CSV_PATH);
};

seedProducts();
