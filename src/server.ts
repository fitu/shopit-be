import { Server } from "http";
import moment from "moment";
import dotenv from "dotenv";

import { handleGeneralErrors } from "./shared/errors";
import db from "./shared/database";
import Product from "./product/domain/product";
import User from "./user/domain/user";
import Cart from "./cart/domain/cart";
import CartItem from "./cartItem/domain/cartItem";
import Order from "./order/domain/order";
import OrderItem from "./orderItem/domain/orderItem";
import Avatar from "./avatar/domain/avatar";
import Review from "./review/domain/review";
import PaymentInfo from "./paymentInfo/domain/paymentInfo";
import ShippingInfo from "./shippingInfo/domain/shippingInfo";
import app from "./app";

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
                  resetPasswordExpire: new Date(moment().add(1, "months").calendar()),
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
