import { Router, Request, Response, NextFunction } from "express";

import UserDao from "../../user/infrastructure/sql/UserDao";
import ProductDao from "../../product/infrastructure/sql/ProductDao";
import Controller from "../../shared/Controller";

class CartController implements Controller {
    public path = "/cart";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router.get(this.path, this.getCart);
        this.router.post(this.path, this.addProductToCart);
        this.router.delete(this.path, this.deleteProductFromCart);
    };

    private getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await UserDao.findByPk(1); // TODO: remove hardcoded
        // const cart = await user.cart;
        // const cartItems = await cart.getCartItems();
        // const products = cartItems.map(async (cartItem) => await cartItem.product);

        // res.status(200).json({ success: true, data: await products });
    };

    private addProductToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { productId } = req.body;

        const user = await UserDao.findByPk(1); // TODO: remove hardcoded
        // const cart = await user.cart;
        // const productsInCart = await cart.getCartItems({ where: { id: productId } });

        // if (productsInCart) {
            // const product = productsInCart[0];

            // const cartItem = await product.getCartItem();
            // const oldQuantity = cartItem.quantity;
            // const newQuantity = oldQuantity + 1;
            // FIXME: const updatedCart = await cart.addProduct(product, { through: { quantity: newQuantity } });
            // const updatedCart = await cart.addCartItems(product);

            // res.status(200).json({ success: true, data: updatedCart });
            return;
        // }

        const newProduct = await ProductDao.findByPk(productId);
        // FIXME: const updatedCart = await cart.addProduct(newProduct, { through: { quantity: 1 } });
        // const updatedCart = await cart.addCartItems(newProduct);

        res.status(200).json({ success: true, data: [] });
    };

    private deleteProductFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { productId } = req.body;

        const user = await UserDao.findByPk(1); // TODO: remove hardcoded
        // const cart = await user.cart;
        // const products = await cart.getCartItems({ where: { id: productId } });

        // if (!products) {
            res.status(400).json({ success: false });
            return;
        // }

        // const product = products[0];
        // const cartItem = await product[0].getCartItem();
        // await cartItem.destroy();

        res.status(200).json({ success: true });
    };
}

export default CartController;
