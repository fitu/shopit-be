import csv from "csv-parser";
import fs from "fs";

import Cart from "../../cart/domain/Cart";
import CartRepository from "../../cart/infrastructure/CartRepository";
import ProductRepository from "../../product/infrastructure/ProductRepository";
import UserRepository from "../../user/infrastructure/UserRepository";
import validateEnv from "../../shared/env/envUtils";
import User from "../../user/domain/User";
import Product from "../../product/domain/Product";

import Db from "./SqlDb";

const USERS_CSV_PATH = "./src/user/infrastructure/data/users.csv";
const CARTS_CSV_PATH = "./src/cart/infrastructure/data/carts.csv";
const PRODUCTS_CSV_PATH = "./src/product/infrastructure/data/products.csv";

const seedProducts = async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize the DB
        const db = new Db(env);
        await db.init({ force: true });

        await db.clearDB();

        const userRepository = new UserRepository();
        const cartRepository = new CartRepository();
        const productRepository = new ProductRepository();

        await Promise.all([
            createUsers(userRepository),
            createCarts(cartRepository, userRepository),
            createUserProducts(productRepository, userRepository),
        ]);
    } catch (error) {
        console.error(`There was an error populating the db: ${error}`);
    } finally {
        console.log("DB fulfilled!");
        process.exit();
    }
};

const createUsers = async (userRepository: UserRepository): Promise<void> => {
    console.log("Create users");
    const users: Array<User> = [];

    return new Promise(() => {
        fs.createReadStream(USERS_CSV_PATH)
            .pipe(csv())
            .on("data", (data) => users.push(data))
            .on("end", async () => {
                await Promise.all(
                    users.map(async (user) => {
                        await userRepository.save(user);
                    })
                );
            });
    });
};

const createCarts = async (cartRepository: CartRepository, userRepository: UserRepository): Promise<void> => {
    console.log("Create carts");
    const carts: Array<Cart> = [];

    return new Promise(() => {
        fs.createReadStream(CARTS_CSV_PATH)
            .pipe(csv())
            .on("data", (data) => carts.push(data))
            .on("end", async () => {
                await Promise.all(
                    carts.map(async (cart) => {
                        await cartRepository.save(cart);
                        await userRepository.addCart(1, cart);
                    })
                );
            });
    });
};

const createUserProducts = (productRepository: ProductRepository, userRepository: UserRepository): Promise<void> => {
    console.log("Create products");
    const products: Array<Product> = [];

    return new Promise(() => {
        fs.createReadStream(PRODUCTS_CSV_PATH)
            .pipe(csv())
            .on("data", (data) => products.push(data))
            .on("end", async () => {
                await Promise.all(
                    products.map(async (product) => {
                        // const newProduct = await productRepository.save(product);
                        // await userRepository.addProduct(1, newProduct.id);
                    })
                );
            });
    });
};

seedProducts();
