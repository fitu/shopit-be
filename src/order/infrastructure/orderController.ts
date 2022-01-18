import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import Controller from "../../shared/Controller";

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
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };

    private createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };
}

export default OrderController;
