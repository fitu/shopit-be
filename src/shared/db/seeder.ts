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

const seedProducts = async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Initialize the DB
        const db = new Db(env);
        await db.init({ force: true });

        await db.clearDB();

        const userRepository = new UserRepository();
        const productRepository = new ProductRepository();
        const cartRepository = new CartRepository();

        await createUserWithCart(userRepository, cartRepository);
        await createUserProducts(productRepository, userRepository);
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
                const savedUser = await userRepository.save(user);
                const newCart = new Cart(1, 0, 0, 0);
                const savedCart = await cartRepository.save(newCart);
                await userRepository.addCart(savedUser, savedCart);
            });
        });
};

const createUserProducts = (productRepository: ProductRepository, userRepository: UserRepository): Promise<void> => {
    console.log("Create products and set them to users");
    const products: Array<Product> = [];
    fs.createReadStream("../../product/infrastructure/products.csv")
        .pipe(csv())
        .on("data", (data) => products.push(data))
        .on("end", async () => {
            products.forEach(async (product) => {
                const newProduct = await productRepository.save(product);
                await userRepository.addProduct(1, newProduct.id);
            });
        });
    return;
};

seedProducts();
