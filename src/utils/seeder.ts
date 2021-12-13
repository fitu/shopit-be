import dotenv from "dotenv";
import moment from "moment";

// import db from "./database";
// import User from "../models/user";

dotenv.config();

const seedProducts = async () => {
    // await db.sync({ force: true });

    // const newAdmin = await createUser();
    // const adminCart = await createCart(newAdmin);
    
    // TODO: add seeder
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
    try {
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

// const createUser = async () => {
//     User.create({
//         firstName: "Victorio",
//         lastName: "Matteucci",
//         email: "victorio.matteucci@shopit.com",
//         role: "admin",
//         password: "computadorar",
//         resetPasswordToken: "token123",
//         resetPasswordExpire: moment().add(1, "months").calendar(),
//     });
// };

// const createCart = async (user) => {
//     user.createCart();
// };

seedProducts();