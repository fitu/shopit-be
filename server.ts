import { Server } from 'http';

const app = require('./app');
const { handleGeneralErrors } = require('./utils/errors');

// TODO: use another file for production, not env vars
// FIXME: this is not working
if (process.env.NODE_ENV !== 'PRODUCTION') {
    const dotenv = require('dotenv');
    dotenv.config();
}

// DB
const db = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Product.belongsToMany(Cart, { through: CartItem });

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

db.sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then((user: typeof User) => {
        return user
            ? user
            : User.create({
                  firstName: 'foo',
                  lastName: 'bar',
                  email: 'foo@bar.com',
                  role: 'admin',
                  password: 'computadorar',
                  resetPasswordToken: 'token',
                  resetPasswordExpire: new Date(),
              });
    })
    .then((user: typeof User) => {
        return user.createCart();
    })
    .then(() => {
        const server: Server = app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        handleGeneralErrors(server);
    })
    .catch((error: Error) => console.log(error));
