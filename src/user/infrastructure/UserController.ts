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
        // res.cookie('csrf-token', req.csrfToken());
        res.status(httpStatus.OK).json({ success: true, foo: req.csrfToken() });
    };
}

// TODO: implement this on Frontend
// import cookie from 'react-cookies';
// this.csrf = cookie.load('csrf-token');
// axios.post(..., headers: { 'csrf-token': this.csrf })

export default UserController;
