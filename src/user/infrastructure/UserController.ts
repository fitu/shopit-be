import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import EmailService from "../../shared/integrations/emails/EmailService";
import Controller from "../../shared/Controller";
import UserData from "../application/UserData";
import { UserRole } from "../domain/User";
import UserService from "../domain/UserService";
import UserViewModel from "./UserViewModel";
import CreateUserInteractor from "../application/CreateUserInteractor";

class UserController implements Controller {
    public path = "/users";
    public router = Router();

    private userService: UserService;
    private emailService: EmailService;

    constructor(userService: UserService, emailService: EmailService) {
        this.emailService = emailService;
        this.userService = userService;

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

    private signUpUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {
            firstName,
            lastName,
            email,
            role,
            password,
        }: {
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            password: string;
        } = req.body;
    
        const userData = new UserData({
            firstName,
            lastName,
            email,
            role,
            password,
        });
        const data = { userData };
    
        const interactor = new CreateUserInteractor(data, this.userService, this.emailService);
        const result = await interactor.execute();
    
        const newUser = UserViewModel.fromData(result);
    
        res.status(httpStatus.OK).json({ success: true, data: newUser });
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
