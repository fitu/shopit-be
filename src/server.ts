import CartController from "./cart/infrastructure/CartController";
import CartRepository from "./cart/infrastructure/CartRepository";
import OrderController from "./order/infrastructure/OrderController";
import ProductController from "./product/infrastructure/ProductController";
import ProductService from "./product/domain/ProductService";
import ProductRepository from "./product/infrastructure/ProductRepository";
import UserRepository from "./user/infrastructure/UserRepository";
import UserController from "./user/infrastructure/UserController";
import Db from "./shared/db/SqlDb";
import validateEnv from "./shared/env/envUtils";

import App from "./app";

(async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize and connect to DB
        const db = new Db(env);
        await db.init();

        // Create Repos
        const productRepository = new ProductRepository();
        const userRepository = new UserRepository();
        const cartRepository = new CartRepository();

        // Create Services
        const productService = new ProductService(productRepository, userRepository);

        // Create the app and start listening for connections
        const app = new App([
            new CartController(),
            new OrderController(),
            new ProductController(productService),
            new UserController(),
        ]);

        app.listen();
    } catch (error) {
        console.error("Error while connecting to the database", error);
        return error;
    }
})();
