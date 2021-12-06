import { Request, Response, NextFunction } from 'express';

const User = require('../models/user');

const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findByPk(1); // TODO: remove hardcoded
    const orders = await user.getOrders({ include: ['products'] });

    res.status(200).json({ success: true, data: orders });
};

const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findByPk(1); // TODO: remove hardcoded
    const cart = await user.getCart();
    const products = await cart.getProducts();
    const order = await user.createOrder();

    const productsToSave = products.map((product) => ({ ...product, orderItem: { quantity: product.cartItem.quantity } }));
    await order.addProducts(productsToSave);
    await cart.setProducts(null);

    res.status(200).json({ success: true });
};

module.exports = { getOrders, createOrder };
