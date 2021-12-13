import { Request, Response, NextFunction } from "express";

import Order from "../models/order";
import User from "../models/user";

const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findByPk(1); // TODO: remove hardcoded
    const orders = await user.getOrders({ include: ["products"] });

    res.status(200).json({ success: true, data: orders });
};

const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findByPk(1); // TODO: remove hardcoded
    const cart = await user.getCart();
    const products = await cart.getProducts();
    const order = await Order.create();
    await user.setOrder(order);

    const productsToSave = products.map(async (product) => {
        const cartItem = await product.getCartItem();
        return {
            ...product,
            orderItem: { quantity: cartItem.quantity },
        };
    });
    // await order.addProducts(productsToSave);
    await cart.setProducts(null);

    res.status(200).json({ success: true });
};

export { getOrders, createOrder };
