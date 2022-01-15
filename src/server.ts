import CartController from "./cart/infrastructure/CartController";
import OrderController from "./order/infrastructure/OrderController";
import ProductController from "./product/infrastructure/ProductController";
import UserController from "./user/infrastructure/UserController";
import ProductService from "./product/domain/ProductService";
import validateEnv from "./shared/env/envUtils";
import getRepositories from "./shared/repository/Repository";
import { getDb } from "./shared/db/database";

import App from "./app";

(async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize and connect to DB
        const db = getDb(env);
        await db.init();

        // Create Repositories
        const { productRepository } = getRepositories(env);

        // Create Services
        const productService = new ProductService(productRepository);

        // Create the app and start listening for connections
        const controllers = [
            new CartController(),
            new OrderController(),
            new ProductController(productService),
            new UserController(),
        ];
        const app = new App(env, db, controllers);

        app.listen();
    } catch (error) {
        console.error("Error while connecting to the database", error);
        return error;
    }
})();
