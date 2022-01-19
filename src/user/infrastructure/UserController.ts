import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import nodemailer from "nodemailer";
import sendGridTransport from "nodemailer-sendgrid-transport";

import Controller from "../../shared/Controller";

const transportOptions = { auth: { api_key: "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" } };
const transporter = nodemailer.createTransport(sendGridTransport(transportOptions));

class UserController implements Controller {
    public path = "/users";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router.get(`${this.path}/sign-in`, this.getCSRFForLogin);
        this.router.post(`${this.path}/sign-in`, this.signInUser);
        this.router.post(`${this.path}/sign-up`, this.signUpUser);
    };

    private signInUser = (req: Request, res: Response, next: NextFunction): void => {
        res.status(httpStatus.OK).json({ success: true });
    };

    private signUpUser = (req: Request, res: Response, next: NextFunction): void => {
        const email = req.body.email;
        transporter.sendMail({
            to: email,
            from: "victorio.matteucci.shopit@gmail.com",
            subject: "Thanks for creating a new account!",
            html: "<h1>You successfully signed up! :)</h1>",
        });

        res.status(httpStatus.OK).json({ success: true });
    };

    private getCSRFForLogin = (req: Request, res: Response, next: NextFunction): void => {
        res.cookie("XSRF-TOKEN", req.csrfToken());
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
