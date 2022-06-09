import { Server } from "socket.io";
import { zip } from "lodash";

import ProductCSV from "../../../product/infrastructure/noSql/ProductCSV";
import ReviewCSV from "../../../review/infrastructure/noSql/ReviewCSV";
import ShippingInfoCSV from "../../../shippingInfo/infrastructure/noSql/ShippingInfoCSV";
import UserCSV from "../../../user/infrastructure/noSql/UserCSV";
import ShippingInfo from "../../../shippingInfo/domain/ShippingInfo";
import ProductService from "../../../product/domain/ProductService";
import ReviewService from "../../../review/domain/ReviewService";
import UserService from "../../../user/domain/UserService";
import { readFromCsv } from "../../../shared/data/csvUtils";
import getRepositories from "../../../shared/repository/Repository";
import validateEnv from "../../env/envUtils";
import { DbQuery, DbType } from "../database";

import Db from "./NoSqlDb";
import { convertUUIDToId } from "./csvUtils";

const PRODUCTS_CSV_PATH = "./src/product/infrastructure/data/products.csv";
const REVIEWS_CSV_PATH = "./src/review/infrastructure/data/reviews.csv";
const SHIPPINGS_INFO_CSV_PATH = "./src/shippingInfo/infrastructure/data/shippingsInfo.csv";
const USERS_CSV_PATH = "./src/user/infrastructure/data/users.csv";

const seedDb = async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize the DB
        const db = new Db(env);
        const initializedDb = await db.init();

        await db.clearDB();

        // Create Repositories
        const envsWithType = {
            ...env,
            DB_TYPE: DbType.NO_SQL.toString(),
            DB_QUERIES: DbQuery.ORM.toString(),
        };
        const { productRepository, userRepository, reviewRepository } = getRepositories(envsWithType, initializedDb);

        // Create socket
        const io = new Server()

        // Create services
        const userService = new UserService(userRepository);
        const productService = new ProductService(productRepository);
        const reviewService = new ReviewService(reviewRepository);

        await createUsers(userService);
        await createProducts(productService);
        await createReviews(reviewService);
    } catch (error: any) {
        console.error(`There was an error populating the db: ${error}`);
    } finally {
        console.log("DB fulfilled!");
        process.exit();
    }
};

const createUsers = async (userService: UserService): Promise<void> => {
    const usersCSV = await readFromCsv<UserCSV>(USERS_CSV_PATH);
    const users = usersCSV.map((userCSV) => UserCSV.toModel(userCSV));

    const shippingsInfoCSV = await readFromCsv<ShippingInfoCSV>(SHIPPINGS_INFO_CSV_PATH);
    const shippingsInfo = shippingsInfoCSV.map((shippingInfoCSV) => ShippingInfoCSV.toModel(shippingInfoCSV));
    const userIdsInShippingInfo = shippingsInfoCSV.map((shippingInfoCSV) => shippingInfoCSV.userId);
    const shippingInfoWithUserIds: Array<[ShippingInfo, string]> = zip(shippingsInfo, userIdsInShippingInfo);

    const usersWithShippingInfo = users.map((user) => {
        const shippingInfosOfUser = shippingInfoWithUserIds.filter(([_, userId]) => userId === user.id);
        if (!shippingInfosOfUser) {
            return user;
        }

        const userShippingsInfo = shippingInfosOfUser.map(([shippingInfo, _]) => shippingInfo);

        return { ...user, shippingsInfo: userShippingsInfo };
    });

    await userService.createBulk(usersWithShippingInfo);
};

const createProducts = async (productService: ProductService): Promise<void> => {
    const productsCSV = await readFromCsv<ProductCSV>(PRODUCTS_CSV_PATH);
    const products = productsCSV.map((productCSV) => ProductCSV.toModel(productCSV));
    const userIds = productsCSV.map((productCSV) => convertUUIDToId(productCSV.userId));
    await productService.createBulk(products, userIds);
};

const createReviews = async (reviewService: ReviewService): Promise<void> => {
    const reviewsCSV = await readFromCsv<ReviewCSV>(REVIEWS_CSV_PATH);
    const reviews = reviewsCSV.map((reviewCSV) => ReviewCSV.toModel(reviewCSV));
    const productIds = reviewsCSV.map((reviewCSV) => convertUUIDToId(reviewCSV.productId));
    const userIds = reviewsCSV.map((reviewCSV) => convertUUIDToId(reviewCSV.userId));
    await reviewService.createBulk(reviews, productIds, userIds);
};

seedDb();
