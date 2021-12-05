const dotenv = require('dotenv');

// const User = require('../models/user');
// const Product = require('../models/product');
// const { getRandomNumberInRange } = require('./numberUtils');
// const mockUsers = require('../mock/users');
// const mockProducts = require('../mock/products');
// const { connectOrdersDatabase } = require('../db/database');

dotenv.config();

const seedProducts = async () => {
    // TODO: add seeder
    // try {
    //     await connectOrdersDatabase(process.env.ORDERS_DB_LOCAL_URL);
    //     await User.deleteMany();
    //     console.log('Users deleted');
    //     await Product.deleteMany();
    //     console.log('Products deleted');
    //     const users = await User.insertMany(mockUsers);
    //     console.log('Users added');
    //     await Product.insertMany(
    //         mockProducts.map((product) => {
    //             const randomUser = users[getRandomNumberInRange(users.length)];
    //             return { ...product, user: randomUser._id };
    //         }),
    //     );
    //     console.log('Products added');
    // } catch (error) {
    //     console.log(error);
    // } finally {
    //     process.exit();
    // }
};

seedProducts();
