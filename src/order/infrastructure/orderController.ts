import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import isAuth from "../../shared/middlewares/isAuth";
import Controller from "../../shared/Controller";

class OrderController implements Controller {
    public path = "/orders";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router.get(this.path, isAuth, this.getOrders);
        this.router.post(this.path, isAuth, this.createOrder);
    };

    private getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };

    private createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };
}

export default OrderController;
