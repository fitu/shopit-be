import { Server } from "socket.io";
import yargs from "yargs";

import ProductService from "@product/domain/ProductService";
import ReviewService from "@review/domain/ReviewService";
import ShippingInfoService from "@shippingInfo/domain/ShippingInfoService";
import UserService from "@user/domain/UserService";
import validateEnv from "@shared/env/envUtils";
import getRepositories from "@shared/repositories/Repository";
import { getSeeder } from "@shared/db/seeder";
import { getDb } from "@shared/db/database";

const seedDb = async (dbType: string) => {
    // Validate env before start
    const env = validateEnv();
    const dbQuery = env.DB_QUERIES;

    // Initialize and connect to DB
    const db = getDb(env, dbType);
    await db.init({ force: true });

    // Clear data
    await db.clearDB();

    // TODO: add io
    // Create Socket
    // const io = new Server();

    // Create Repositories
    const { productRepository, userRepository, shippingInfoRepository, reviewRepository } = getRepositories(
        db.getInstance(),
        dbType,
        dbQuery
    );

    // Create Services
    const userService = new UserService(userRepository);
    const shippingInfoService = new ShippingInfoService(shippingInfoRepository);
    const productService = new ProductService(productRepository);
    const reviewService = new ReviewService(reviewRepository);

    try {
        // Populate DB
        const seeder = getSeeder(dbType, userService, shippingInfoService, productService, reviewService);
        await seeder.seed();
        console.log("DB fulfilled!");
    } catch (error: any) {
        console.error(`There was an error populating the db: ${error}`);
    } finally {
        process.exit();
    }
};

// Load the arguments
const argv = yargs
    .scriptName("seeder")
    .usage("Usage: $0 -t DbType")
    .example("$0 -t sql", "Populate SQL")
    .example("$0 -t no_sql", "Populate NO SQL")
    .example("$0 -t in_memory", "Populate IN MEMORY")
    .option("t", {
        alias: "type",
        describe: "DB type",
        demandOption: "DB type is required",
        choices: ["sql", "no_sql", "in_memory"],
        nargs: 1,
    }).argv;

const { type } = argv;

// Populate db
seedDb(type);
