import { Request, Response, NextFunction } from 'express';

const User = require('../models/user');
const Product = require('../models/product');

const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findByPk(1); // TODO: remove hardcoded
    const cart = await user.getCart();
    const products = await cart.getProducts();

    res.status(200).json({ success: true, products });
};

const addProductToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.body;

    const user = await User.findByPk(1); // TODO: remove hardcoded
    const cart = await user.getCart();
    const productsInCart = await cart.getProducts({ where: { id: productId } });

    if (productsInCart) {
        const product = productsInCart[0];

        const oldQuantity = product.cartItem.quantity;
        const newQuantity = oldQuantity + 1;
        const updatedCart = await cart.addProduct(product, { throught: { quantity: newQuantity } });

        res.status(200).json({ success: true, updatedCart });
        return;
    }

    const newProduct = await Product.findByPk(productId);
    const updatedCart = await cart.addProduct(newProduct, { throught: { quantity: 1 } });

    res.status(200).json({ success: true, cart: updatedCart });
};

const deleteProductFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.body;

    const user = await User.findByPk(1); // TODO: remove hardcoded
    const cart = await user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });

    if (!products) {
        res.status(400).json({ success: false });
        return;
    }

    const product = products[0];
    await product.cartItem.destroy();

    res.status(200).json({ success: true });
};

module.exports = { getCart, addProductToCart, deleteProductFromCart };
