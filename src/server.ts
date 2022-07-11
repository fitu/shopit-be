import { Server } from "socket.io";

import CartController from "./modules/cart/infrastructure/CartController";
import OrderController from "./modules/order/infrastructure/OrderController";
import ProductController from "./modules/product/infrastructure/ProductController";
import UserController from "./modules/user/infrastructure/UserController";
import UserService from "./modules/user/domain/UserService";
import ProductService from "./modules/product/domain/ProductService";
import validateEnv from "./shared/env/envUtils";
import getRepositories from "./shared/repositories/Repository";
import EmailService from "./shared/integrations/emails/EmailService";
import FileService from "./shared/integrations/files/FileService";
import { getDb } from "./shared/db/database";

import App from "./app/app";
import ParserMiddleware from "./app/middlewares/ParserMiddleware";
import CORSMiddleware from "./app/middlewares/CORSMiddleware";
import HeadersMiddleware from "./app/middlewares/HeadersMiddleware";
import LogsMiddleware from "./app/middlewares/LogsMiddleware";
import CSRFMiddleware from "./app/middlewares/CSRFMiddleware";
import I18nMiddleware from "./app/middlewares/I18nMiddleware";
import StaticResourcesMiddleware from "./app/middlewares/StaticResourcesMiddleware";

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

        // Create Middlewares
        const middlewares = [
            new ParserMiddleware(),
            new CORSMiddleware(),
            new HeadersMiddleware(),
            new LogsMiddleware(),
            // TODO: check this
            // new CSRFMiddleware(),
            new I18nMiddleware(),
            new StaticResourcesMiddleware(),
        ];

        // Create app and launch it!
        const app = new App(controllers, middlewares);
        await app.init();
        await app.listen();
    } catch (error: any) {
        console.error("Error while connecting to the database", error);
    }
})();
