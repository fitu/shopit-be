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
        this.router.get(`${this.path}/login`, this.getCSRFForLogin);
        this.router.post(`${this.path}/login`, this.loginUser);
    };

    private loginUser = (req: Request, res: Response, next: NextFunction): void => {
        res.status(httpStatus.OK).json({ success: true });
    };

    private getCSRFForLogin = (req: Request, res: Response, next: NextFunction): void => {
        res.cookie('XSRF-TOKEN', req.csrfToken())
        res.status(httpStatus.OK).json({ success: true });
    };
}

// TODO: implement this on Frontend
// import cookie from 'react-cookies';
// this.csrf = cookie.load('csrf-token');
// axios.post(..., headers: { 'csrf-token': this.csrf })
// Many SPA frameworks like Angular have CSRF support built in automatically. Typically they will reflect the value from a specific cookie, like XSRF-TOKEN (which is the case for Angular).

// To take advantage of this, set the value from req.csrfToken() in the cookie used by the SPA framework. This is only necessary to do on the route that renders the page (where res.render or res.sendFile is called in Express, for example).

// The following is an example for Express of a typical SPA response:

// app.all('*', function (req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken())
//   res.render('index')
// })

export default UserController;
