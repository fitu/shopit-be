import dotenv from "dotenv";
import csv from "csv-parser";
import fs from "fs";

import Product from "../../product/domain/product";
import Cart from "../../cart/domain/cart";
import User from "../../user/domain/user";

import db from "./database";

dotenv.config();

const seedProducts = async () => {
    try {
        await db.sync({ force: true });

        await clearDatabase();
        await createUserWithCart();
        await createUserProducts();
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

const clearDatabase = async (): Promise<void> => {
    console.log("Delete users");
    User.destroy({ where: {}, truncate: true });

    console.log("Delete carts");
    Cart.destroy({ where: {}, truncate: true });

    console.log("Delete products");
    Product.destroy({ where: {}, truncate: true });
};

const createUserWithCart = async (): Promise<void> => {
    console.log("Create users and set carts");
    const users: Array<User> = [];
    fs.createReadStream("../../user/infrastructure/users.csv")
        .pipe(csv())
        .on("data", (data) => users.push(data))
        .on("end", async () => {
            users.forEach(async (user) => {
                const newUser = await User.create({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    password: user.password,
                    resetPasswordToken: user.resetPasswordToken,
                    resetPasswordExpire: new Date(user.resetPasswordExpire),
                });
                const cart = await Cart.create({
                    itemsPrice: 0,
                    taxPrice: 0,
                    totalPrice: 0,
                });
                await newUser.setCart(cart);
            });
        });
};

const createUserProducts = (): Promise<void> => {
    console.log("Create products and set them to users");
    const products: Array<Product> = [];
    fs.createReadStream("../../product/infrastructure/products.csv")
        .pipe(csv())
        .on("data", (data) => products.push(data))
        .on("end", async () => {
            products.forEach(async (product) => {
                const newProduct = await Product.create({
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    ratings: product.ratings,
                    category: product.category,
                    stock: product.stock,
                });
                await newProduct.setUser(1);
            });
        });
    return;
};

seedProducts();
