import { Server } from "http";
import moment from "moment";
import dotenv from "dotenv";

import app from "./app";
import { handleGeneralErrors } from "./utils/errors";
import db from "./utils/database";
import Product from "./models/product";
import User from "./models/user";
import Cart from "./models/cart";
import CartItem from "./models/cartItem";
import Order from "./models/order";
import OrderItem from "./models/orderItem";
import Avatar from "./models/avatar";
import Review from "./models/review";
import PaymentInfo from "./models/paymentInfo";
import ShippingInfo from "./models/shippingInfo";

// TODO: use another file for production, not env vars
// FIXME: this is not working
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config();
}

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
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

db.sync({ force: true })
    .then(() => User.findByPk(1))
    .then((user) =>
        user
            ? user
            : User.create({
                  firstName: "Victorio",
                  lastName: "Matteucci",
                  email: "victorio.matteucci@shopit.com",
                  role: "admin",
                  password: "computadorar",
                  resetPasswordToken: "token123",
                  resetPasswordExpire: moment().add(1, "months").calendar(),
              })
    )
    .then((user: any) => user.createCart())
    .then(() => {
        const server: Server = app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        handleGeneralErrors(server);
    })
    .catch((error: Error) => console.log(error));
