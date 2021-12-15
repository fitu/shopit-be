import { Router, Request, Response, NextFunction } from "express";

import Controller from "../../shared/Controller";
import Order from "./order";
import User from "../../user/infrastructure/user";

class OrderController implements Controller {
    public path = "/orders";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router.get(this.path, this.getOrders);
        this.router.post(this.path, this.createOrder);
    };

    private getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await User.findByPk(1); // TODO: remove hardcoded
        const orders = await user.getOrders({ include: ["products"] });

        res.status(200).json({ success: true, data: orders });
    };

    private createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await User.findByPk(1); // TODO: remove hardcoded
        const cart = await user.cart;
        const order = await Order.create();
        await user.setOrders([order]);

        const cartItems = await cart.getCartItems();
        const productsToSave = cartItems.map(async (cartItem) => {
            const product = await cartItem.product;

            return {
                ...product,
                orderItem: { quantity: cartItem.quantity },
            };
        });
        // await order.addProducts(productsToSave);
        await cart.setCartItems(cartItems);

        res.status(200).json({ success: true });
    };
}

export default OrderController;
