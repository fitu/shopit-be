import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import EmailService from "../../shared/integrations/emails/EmailService";
import Controller from "../../shared/Controller";
import { generateJWTToken } from "../../shared/utils/hashUtils";
import UserData from "../application/UserData";
import { UserRole } from "../domain/User";
import UserService from "../domain/UserService";
import UserViewModel from "./UserViewModel";
import CreateUserInteractor from "../application/CreateUserInteractor";
import ForgotPasswordInteractor from "../application/ForgotPasswordInteractor";
import ResetPasswordInteractor from "../application/ResetPasswordInteractor";
import SignInUserInteractor from "../application/SignInUserInteractor";

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
        this.router.post(
            `${this.path}/sign-in`,
            [body("email").notEmpty().isEmail(), body("password").notEmpty().isLength({ min: 6 })],
            this.signInUser
        );
        this.router.post(
            `${this.path}/sign-up`,
            [
                body("firstName").notEmpty().isString().trim(),
                body("lastName").notEmpty().isString().trim(),
                body("email").notEmpty().isEmail(),
                body("role")
                    .notEmpty()
                    .custom((value) => {
                        // TODO: remove hardcoded
                        if (value !== "admin" && value !== "user") {
                            // TODO: remove hardcoded
                            throw new Error("Invalid role input");
                        }
                        return true;
                    })
                    .trim(),
                body("password").notEmpty().isLength({ min: 6 }),
            ],
            this.signUpUser
        );
        this.router.post(`${this.path}/forgot-password`, body("email").notEmpty().isEmail(), this.forgotPassword);
        this.router.post(
            `${this.path}/reset-password`,
            [
                body("email").notEmpty().isEmail(),
                body("newPassword").notEmpty().isLength({ min: 6 }),
                body("resetPasswordToken").notEmpty().isString().trim(),
            ],
            this.resetPassword
        );
    };

    private signInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password }: { email: string; password: string } = req.body;

        const data = { email, password };

        const interactor = new SignInUserInteractor(this.userService);
        try {
            const result = await interactor.execute(data);
            const token = await generateJWTToken(result.email);

            res.status(httpStatus.OK).json({ success: true, data: token });
        } catch (err) {
            next(new Error(err));
        }
    };

    private signUpUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // TODO: add validations
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

        const interactor = new CreateUserInteractor(this.userService, this.emailService);
        const result = await interactor.execute(data);

        const newUser = UserViewModel.fromData(result);

        res.status(httpStatus.OK).json({ success: true, data: newUser });
    };

    private forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // TODO: add validations
        const { email }: { email: string } = req.body;

        const data = { email };

        const interactor = new ForgotPasswordInteractor(this.userService, this.emailService);
        try {
            await interactor.execute(data);
            res.status(httpStatus.OK).json({ success: true });
        } catch (err) {
            next(new Error(err));
        }
    };

    private resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // TODO: add validations
        const {
            email,
            newPassword,
            resetPasswordToken,
        }: { email: string; newPassword: string; resetPasswordToken: string } = req.body;

        const data = { email, newPassword, resetPasswordToken };

        const interactor = new ResetPasswordInteractor(this.userService);
        try {
            const result = await interactor.execute(data);
            res.status(httpStatus.OK).json({ success: result });
        } catch (err) {
            next(new Error(err));
        }
    };
}

export default UserController;
