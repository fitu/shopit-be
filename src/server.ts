import { Server } from "socket.io";

import CartController from "@cart/infrastructure/CartController";
import OrderController from "@order/infrastructure/OrderController";
import ProductController from "@product/infrastructure/ProductController";
import UserController from "@user/infrastructure/UserController";
import UserService from "@user/domain/UserService";
import ProductService from "@product/domain/ProductService";
import validateEnv from "@shared/env/envUtils";
import getRepositories from "@shared/repositories/Repository";
import EmailService from "@shared/integrations/emails/EmailService";
import FileService from "@shared/integrations/files/FileService";
import { getDb } from "@shared/db/database";
import App from "@app/app";
import ParserMiddleware from "@app/middlewares/ParserMiddleware";
import CORSMiddleware from "@app/middlewares/CORSMiddleware";
import HeadersMiddleware from "@app/middlewares/HeadersMiddleware";
import LogsMiddleware from "@app/middlewares/LogsMiddleware";
import CSRFMiddleware from "@app/middlewares/CSRFMiddleware";
import I18nMiddleware from "@app/middlewares/I18nMiddleware";
import StaticResourcesMiddleware from "@app/middlewares/StaticResourcesMiddleware";

(async () => {
    try {
        // Validate env before start
        const env = validateEnv();
        const dbType = env.DB_TYPE;
        const dbQuery = env.DB_QUERIES;

        // Initialize and connect to DB
        const db = getDb(env, dbType);
        await db.init();

        // Create Socket
        // const io = new Server();

        // Create Repositories
        const { productRepository, userRepository, emailRepository, fileRepository } = getRepositories(
            db.getInstance(),
            dbType,
            dbQuery
        );

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
