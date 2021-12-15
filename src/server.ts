import CartController from "./cart/infrastructure/cartController";
import OrderController from "./order/infrastructure/orderController";
import ProductController from "./product/infrastructure/productController";
import UserController from "./user/infrastructure/authController";
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

        // Create the app and start listening for connections
        const app = new App([
            new CartController(),
            new OrderController(),
            new ProductController(),
            new UserController(),
        ]);

        app.listen();
    } catch (error) {
        console.error("Error while connecting to the database", error);
        return error;
    }
})();
