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

const USERS_CSV_PATH = "../../user/infrastructure/data/users.csv";
const PRODUCTS_CSV_PATH = "../../product/infrastructure/data/products.csv";

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
        console.error(`There was an error populating the db: ${error}`);
    } finally {
        console.log("DB fulfilled!");
        process.exit();
    }
};

const createUserWithCart = async (userRepository: UserRepository, cartRepository: CartRepository): Promise<void> => {
    console.log("Create users and set carts");
    const users: Array<User> = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(USERS_CSV_PATH)
            .pipe(csv())
            .on("data", (data) => users.push(data))
            .on("end", async () => {
                await Promise.all(
                    users.map(async (user) => {
                        console.log(`Creating user: ${user}`);
                        // const savedUser = await userRepository.save(user);
                        // const newCart = new Cart(1, 0, 0, 0);
                        // const savedCart = await cartRepository.save(newCart);
                        // await userRepository.addCart(savedUser, savedCart);
                        resolve();
                    })
                );

                resolve();
            });
    });
};

const createUserProducts = (productRepository: ProductRepository, userRepository: UserRepository): Promise<void> => {
    console.log("Create products and set them to users");
    const products: Array<Product> = [];
    
    return new Promise((resolve, reject) => {
        fs.createReadStream(PRODUCTS_CSV_PATH)
            .pipe(csv())
            .on("data", (data) => products.push(data))
            .on("end", async () => {
                await Promise.all(
                    products.map(async (product) => {
                        console.log(`Creating product: ${product}`);
                        // const newProduct = await productRepository.save(product);
                        // await userRepository.addProduct(1, newProduct.id);
                        resolve();
                    })
                );

                resolve();
            });
    });
};

seedProducts();
