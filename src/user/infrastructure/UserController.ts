import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import Controller from "../../shared/Controller";
class UserController implements Controller {
    public path = "/users";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router.post(`${this.path}/login`, this.loginUser);
    };

    private loginUser = (req: Request, res: Response, next: NextFunction): void => {
        res.status(httpStatus.OK).json({ success: true });
    };
}

export default UserController;
