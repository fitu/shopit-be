import { Server } from "socket.io";

import ProductCSV from "../../../modules/product/infrastructure/sql/ProductCSV";
import ReviewCSV from "../../../modules/review/infrastructure/sql/ReviewCSV";
import ShippingInfoCSV from "../../../modules/shippingInfo/infrastructure/sql/ShippingInfoCSV";
import UserCSV from "../../../modules/user/infrastructure/sql/UserCSV";
import ProductService from "../../../modules/product/domain/ProductService";
import ReviewService from "../../../modules/review/domain/ReviewService";
import ShippingInfoService from "../../../modules/shippingInfo/domain/ShippingInfoService";
import UserService from "../../../modules/user/domain/UserService";
import validateEnv from "../../env/envUtils";
import getRepositories from "../../repositories/Repository";
import { readFromCsv } from "../../../shared/data/csvUtils";
import { DbType } from "../database";

import Db from "./SqlDb";

const PRODUCTS_CSV_PATH = "./src/modules/product/infrastructure/data/products.csv";
const REVIEWS_CSV_PATH = "./src/modules/review/infrastructure/data/reviews.csv";
const SHIPPINGS_INFO_CSV_PATH = "./src/modules/shippingInfo/infrastructure/data/shippingsInfo.csv";
const USERS_CSV_PATH = "./src/modules/user/infrastructure/data/users.csv";

const seedDb = async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize the DB
        const db = new Db(env);
        const initializedDb = await db.init({ force: true });

        await db.clearDB();

        // Create Repositories
        const envsWithType = {
            ...env,
            DB_TYPE: DbType.SQL.toString(),
        };
        const { productRepository, userRepository, shippingInfoRepository, reviewRepository } = getRepositories(
            envsWithType,
            initializedDb
        );

        // Create socket
        const io = new Server();

        // Create services
        const userService = new UserService(userRepository);
        const shippingInfoService = new ShippingInfoService(shippingInfoRepository);
        const productService = new ProductService(productRepository);
        const reviewService = new ReviewService(reviewRepository);

        await createUsers(userService);
        await createShippingsInfo(shippingInfoService);
        await createProducts(productService);
        await createReviews(reviewService);
        console.log("DB fulfilled!");
    } catch (error: any) {
        console.error(`There was an error populating the db: ${error}`);
    } finally {
        process.exit();
    }
};

const createUsers = async (userService: UserService): Promise<void> => {
    const usersCSV = await readFromCsv<UserCSV>(USERS_CSV_PATH);
    const users = usersCSV.map((userCSV) => UserCSV.toModel(userCSV));
    await userService.insertBatch(users);
};

const createShippingsInfo = async (shippingInfoService: ShippingInfoService): Promise<void> => {
    const shippingsInfoCSV = await readFromCsv<ShippingInfoCSV>(SHIPPINGS_INFO_CSV_PATH);
    const shippingsInfo = shippingsInfoCSV.map((shippingInfoCSV) => ShippingInfoCSV.toModel(shippingInfoCSV));
    const userIds = shippingsInfoCSV.map((shippingInfoCSV) => shippingInfoCSV.userId);
    await shippingInfoService.insertBatch(shippingsInfo, userIds);
};

const createProducts = async (productService: ProductService): Promise<void> => {
    const productsCSV = await readFromCsv<ProductCSV>(PRODUCTS_CSV_PATH);
    const products = productsCSV.map((productCSV) => ProductCSV.toModel(productCSV));
    const userIds = productsCSV.map((productCSV) => productCSV.userId);
    await productService.insertBatch(products, userIds);
};

const createReviews = async (reviewService: ReviewService): Promise<void> => {
    const reviewsCSV = await readFromCsv<ReviewCSV>(REVIEWS_CSV_PATH);
    const reviews = reviewsCSV.map((reviewCSV) => ReviewCSV.toModel(reviewCSV));
    const productIds = reviewsCSV.map((reviewCSV) => reviewCSV.productId);
    const userIds = reviewsCSV.map((reviewCSV) => reviewCSV.userId);
    await reviewService.insertBatch(reviews, productIds, userIds);
};

seedDb();
