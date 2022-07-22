import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import isAuthMiddleware from "@shared/middlewares/isAuthMiddleware";
import Controller from "@shared/controllers/Controller";

class CartController extends Controller {
    /*
     * Variables and constructor
     */

    public path = "/cart";

    constructor() {
        super();
        this.initializeRoutes();
    }

    /*
     * Route's validations
     */

    /*
     * Routes
     */
    protected override initializeRoutes = (): void => {
        this.router.get(this.path, isAuthMiddleware, this.getCart);
        this.router.post(this.path, isAuthMiddleware, this.addProductToCart);
        this.router.delete(this.path, isAuthMiddleware, this.deleteProductFromCart);
    };

    private getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };

    private addProductToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };

    private deleteProductFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };
}

export default CartController;
