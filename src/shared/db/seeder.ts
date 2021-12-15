import csv from "csv-parser";
import fs from "fs";

import CartRepository from "../../cart/infrastructure/CartRepository";
import ProductRepository from "../../product/infrastructure/ProductRepository";
import UserRepository from "../../user/infrastructure/UserRepository";
import validateEnv from "../../shared/env/envUtils";
import User from "../../user/domain/User";
import Product from "../../product/domain/Product";

import Db from "./SqlDb";

const seedProducts = async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize the DB
        const db = new Db(env);
        await db.init({ force: true });

        await db.clearDB();

        const userRepository = db.getUserRepository();
        const cartRepository = db.getCartRepository();
        const productRepository = db.getProductRepository();

        await createUserWithCart(userRepository, cartRepository);
        await createUserProducts(productRepository);
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

const createUserWithCart = async (userRepository: UserRepository, cartRepository: CartRepository): Promise<void> => {
    console.log("Create users and set carts");
    const users: Array<User> = [];
    fs.createReadStream("../../user/infrastructure/users.csv")
        .pipe(csv())
        .on("data", (data) => users.push(data))
        .on("end", async () => {
            users.forEach(async (user) => {
                const newUser = await userRepository.createUser(user);
                const newCart = await cartRepository.createCart();
                await userRepository.setCartToUser(newUser, newCart);
            });
        });
};

const createUserProducts = (productRepository: ProductRepository): Promise<void> => {
    console.log("Create products and set them to users");
    const products: Array<Product> = [];
    fs.createReadStream("../../product/infrastructure/products.csv")
        .pipe(csv())
        .on("data", (data) => products.push(data))
        .on("end", async () => {
            products.forEach(async (product) => {
                const newProduct = await productRepository.createProduct(product);
                await productRepository.setUser(newProduct, 1);
            });
        });
    return;
};

seedProducts();
