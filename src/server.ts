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
const Avatar = require('./models/avatar');
const Review = require('./models/review');
const PaymentInfo = require('./models/paymentInfo');
const ShippingInfo = require('./models/shippingInfo');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Product.belongsToMany(Cart, { through: CartItem });
Product.hasMany(Review);

Review.belongsTo(User);
Review.belongsTo(Product);

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });
Order.belongsTo(PaymentInfo);
Order.belongsTo(ShippingInfo);

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);
User.hasOne(Avatar);
User.hasMany(Review);
User.hasMany(PaymentInfo);
User.hasMany(ShippingInfo);

Avatar.belongsTo(User);

PaymentInfo.belongsTo(User);
PaymentInfo.hasMany(Order);

ShippingInfo.belongsTo(User);
ShippingInfo.hasMany(Order);

db.sync()
    .then(() => {
        const server: Server = app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        handleGeneralErrors(server);
    })
    .catch((error: Error) => console.log(error));
