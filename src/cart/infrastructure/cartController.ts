import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

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
