import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import EmailService from "../../shared/integrations/emails/EmailService";
import Controller from "../../shared/Controller";

class UserController implements Controller {
    public path = "/users";
    public router = Router();

    private emailService: EmailService;

    constructor(emailService: EmailService) {
        this.emailService = emailService;

        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router.get(`${this.path}/sign-in`, this.getCSRFForLogin);
        this.router.post(`${this.path}/sign-in`, this.signInUser);
        this.router.post(`${this.path}/sign-up`, this.signUpUser);
        this.router.post(`${this.path}/reset-password/`, this.resetPassword);
    };

    private signInUser = (req: Request, res: Response, next: NextFunction): void => {
        res.status(httpStatus.OK).json({ success: true });
    };

    private signUpUser = (req: Request, res: Response, next: NextFunction): void => {
        // TODO: remove hardcoded
        const to = req.body.email;
        const from = "victorio.matteucci.shopit@gmail.com";
        const subject = "Thanks for creating a new account!";
        const body = "<h1>You successfully signed up! :)</h1>";

        this.emailService.sendEmail(to, from, subject, body);

        res.status(httpStatus.OK).json({ success: true });
    };

    // TODO: not required here
    private getCSRFForLogin = (req: Request, res: Response, next: NextFunction): void => {
        res.cookie("XSRF-TOKEN", req.csrfToken());
        res.status(httpStatus.OK).json({ success: true });
    };

    private resetPassword = (req: Request, res: Response, next: NextFunction): void => {
        res.status(httpStatus.OK).json({ success: true });
    };
}

export default UserController;
