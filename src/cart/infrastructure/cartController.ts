import { Request, Response, NextFunction } from "express";

import User from "../../user/domain/user";
import Product from "../../product/domain/product";

const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findByPk(1); // TODO: remove hardcoded
    const cart = await user.cart;
    const cartItems = await cart.getCartItems();
    const products = cartItems.map(async (cartItem) => await cartItem.product);

    res.status(200).json({ success: true, data: await products });
};

const addProductToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.body;

    const user = await User.findByPk(1); // TODO: remove hardcoded
    const cart = await user.cart;
    const productsInCart = await cart.getCartItems({ where: { id: productId } });

    if (productsInCart) {
        const product = productsInCart[0];

        // const cartItem = await product.getCartItem();
        // const oldQuantity = cartItem.quantity;
        // const newQuantity = oldQuantity + 1;
        // FIXME: const updatedCart = await cart.addProduct(product, { through: { quantity: newQuantity } });
        const updatedCart = await cart.addCartItems(product);

        res.status(200).json({ success: true, data: updatedCart });
        return;
    }

    const newProduct = await Product.findByPk(productId);
    // FIXME: const updatedCart = await cart.addProduct(newProduct, { through: { quantity: 1 } });
    // const updatedCart = await cart.addCartItems(newProduct);

    res.status(200).json({ success: true, data: [] });
};

const deleteProductFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.body;

    const user = await User.findByPk(1); // TODO: remove hardcoded
    const cart = await user.cart;
    const products = await cart.getCartItems({ where: { id: productId } });

    if (!products) {
        res.status(400).json({ success: false });
        return;
    }

    const product = products[0];
    const cartItem = await product[0].getCartItem();
    await cartItem.destroy();

    res.status(200).json({ success: true });
};

export { getCart, addProductToCart, deleteProductFromCart };
