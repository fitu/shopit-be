import CartController from "./cart/infrastructure/CartController";
import OrderController from "./order/infrastructure/OrderController";
import ProductController from "./product/infrastructure/ProductController";
import UserController from "./user/infrastructure/UserController";
import UserService from "./user/domain/UserService";
import ProductService from "./product/domain/ProductService";
import validateEnv from "./shared/env/envUtils";
import getRepositories from "./shared/repository/Repository";
import EmailService from "./shared/integrations/emails/EmailService";
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
        const { productRepository, userRepository, emailRepository } = getRepositories(env);

        // Create Services
        const productService = new ProductService(productRepository);
        const userService = new UserService(userRepository);
        const emailService = new EmailService(emailRepository);

        // Initialize Third Party Integrations
        emailService.init(env.KEY_EMAILS);

        // Create Controllers
        const controllers = [
            new CartController(),
            new OrderController(),
            new ProductController(productService),
            new UserController(userService, emailService),
        ];

        // Create app and launch it!
        const app = new App(env, controllers);
        app.listen();
    } catch (error) {
        console.error("Error while connecting to the database", error);
    }
})();
