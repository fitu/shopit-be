import { Server } from "socket.io";

import CartController from "./cart/infrastructure/CartController";
import OrderController from "./order/infrastructure/OrderController";
import ProductController from "./product/infrastructure/ProductController";
import UserController from "./user/infrastructure/UserController";
import UserService from "./user/domain/UserService";
import ProductService from "./product/domain/ProductService";
import validateEnv from "./shared/env/envUtils";
import getRepositories from "./shared/repository/Repository";
import EmailService from "./shared/integrations/emails/EmailService";
import FileService from "./shared/integrations/files/FileService";
import { getDb } from "./shared/db/database";

import App from "./app";

(async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize and connect to DB
        const db = getDb(env);
        const intializedDb = await db.init();

        // Create Repositories
        const { productRepository, userRepository, emailRepository, fileRepository } = getRepositories(
            env,
            intializedDb
        );

        // Create Socket
        const io = new Server();

        // Create Services
        const productService = new ProductService(productRepository);
        const userService = new UserService(userRepository);
        const emailService = new EmailService(emailRepository);
        const fileService = new FileService(fileRepository);

        // Initialize Third Party Integrations
        emailService.init(env.KEY_EMAILS);
        fileService.init();

        // Create Controllers
        const controllers = [
            new CartController(),
            new OrderController(fileService),
            new ProductController(productService, userService),
            new UserController(userService, emailService),
        ];

        // Create app and launch it!
        const app = new App(controllers);
        await app.init();
        await app.listen();
    } catch (error: any) {
        console.error("Error while connecting to the database", error);
    }
})();
