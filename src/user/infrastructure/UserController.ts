import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { body, param, query } from "express-validator";

import NotFoundError from "../../shared/error/NotFoundError";
import { ErrorHandler } from "../../shared/error/ErrorHandler";
import SignInError from "../../shared/error/SignInError";
import NotAllowError from "../../shared/error/NotAllowError";
import InvalidDataError from "../../shared/error/InvalidDataError";
import EmailService from "../../shared/integrations/emails/EmailService";
import Controller from "../../shared/Controller";
import isValid from "../../shared/middlewares/validationMiddleware";
import isAuthMiddleware from "../../shared/middlewares/isAuthMiddleware";
import { generateJWTToken } from "../../shared/utils/hashUtils";
import Page, { getPageAndItemsPerPage } from "../../shared/Page";
import UserData from "../application/UserData";
import { UserRole, validUserRoles } from "../domain/User";
import UserService from "../domain/UserService";
import CreateUserInteractor from "../application/CreateUserInteractor";
import ForgotPasswordInteractor, { ForgotPasswordData } from "../application/ForgotPasswordInteractor";
import ResetPasswordInteractor, { ResetPasswordData } from "../application/ResetPasswordInteractor";
import SignInUserInteractor from "../application/SignInUserInteractor";
import GetAllUsersInteractor, { GetAllUsersData } from "../application/GetAllUsersInteractor";
import GetUserByIdInteractor, { GetUserByIdData } from "../application/GetUserByIdInteractor";
import DeleteUserByIdInteractor, { DeleteUserByIdData } from "../application/DeleteUserByIdInteractor";
import UpdateUserByIdInteractor, { UpdateUserByIdData } from "../application/UpdateUserByIdInteractor";

import UserViewModel from "./UserViewModel";

class UserController implements Controller {
    /*
     * Variables and constructor
     */

    public path = "/users";
    public router = Router();

    private userService: UserService;
    private emailService: EmailService;

    constructor(userService: UserService, emailService: EmailService) {
        this.emailService = emailService;
        this.userService = userService;

        this.initializeRoutes();
    }

    /*
     * Route's validations
     */

    private validations = {
        getOne: [param("id").notEmpty().isUUID()],
        getAll: [
            query("page").isNumeric().optional({ nullable: true }),
            query("itemsPerPage").isNumeric().optional({ nullable: true }),
        ],
        signUpPost: [
            body("firstName").notEmpty().isString().trim(),
            body("lastName").notEmpty().isString().trim(),
            body("email").notEmpty().isEmail(),
            body("role")
                .notEmpty()
                .custom((value) => {
                    if (!validUserRoles.includes(value)) {
                        // TODO: remove hardcoded
                        throw new Error("Invalid role input");
                    }
                    return true;
                })
                .trim(),
            body("password").notEmpty().isLength({ min: 6 }),
        ],
        putOne: [
            body("firstName").isString().trim(),
            body("lastName").isString().trim(),
            body("email").isEmail(),
            body("role")
                .custom((value) => {
                    if (!validUserRoles.includes(value)) {
                        // TODO: remove hardcoded
                        throw new Error("Invalid role input");
                    }
                    return true;
                })
                .trim(),
        ],
        deleteOne: [param("id").notEmpty().isUUID()],
        signInPost: [body("email").notEmpty().isEmail(), body("password").notEmpty().isLength({ min: 6 })],
        forgotPasswordPost: [body("email").notEmpty().isEmail()],
        resetPasswordPost: [
            body("email").notEmpty().isEmail(),
            body("newPassword").notEmpty().isLength({ min: 6 }),
            body("resetPasswordToken").notEmpty().isString().trim(),
        ],
    };

    /*
     * Routes
     */

    private initializeRoutes = (): void => {
        this.router.get(this.path, this.validations.getAll, isValid, this.getUsers);
        this.router.get(`${this.path}/:id`, this.validations.getOne, isValid, this.getUserById);
        this.router.post(`${this.path}/sign-up`, this.validations.signUpPost, this.createUser);
        this.router.put(`${this.path}/:id`, isAuthMiddleware, this.validations.putOne, isValid, this.updateUserById);
        this.router.delete(
            `${this.path}/:id`,
            isAuthMiddleware,
            this.validations.deleteOne,
            isValid,
            this.deleteUserById
        );
        this.router.post(`${this.path}/sign-in`, this.validations.signInPost, this.signInUser);
        this.router.post(`${this.path}/forgot-password`, this.validations.forgotPasswordPost, this.forgotPassword);
        this.router.post(`${this.path}/reset-password`, this.validations.resetPasswordPost, this.resetPassword);
    };

    private getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const data: GetUserByIdData = { userId: id };

        try {
            const interactor = new GetUserByIdInteractor(this.userService);
            const result = await interactor.execute(data);
            const user = UserViewModel.fromData(result);
            res.status(httpStatus.OK).json({ success: true, data: user });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
                return;
            }
            next(error);
        }
    };

    private getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const [page, itemsPerPage] = getPageAndItemsPerPage(req);
        const data: GetAllUsersData = { page, itemsPerPage };

        try {
            const interactor = new GetAllUsersInteractor(this.userService);
            const result = await interactor.execute(data);

            const usersWithMetadata = result as Page<Array<UserData>>;
            const allUsers = {
                ...usersWithMetadata,
                data: usersWithMetadata.data.map((user) => UserViewModel.fromData(user)),
            };

            res.status(httpStatus.OK).json({ success: true, ...allUsers });
        } catch (error: any) {
            next(error);
        }
    };

    private createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // TODO: add validations and check avatar
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

        try {
            const interactor = new CreateUserInteractor(this.userService, this.emailService);
            const result = await interactor.execute(data);
            const newUser = UserViewModel.fromData(result);
            res.status(httpStatus.OK).json({ success: true, data: newUser });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
                return;
            }
            if (error instanceof NotAllowError) {
                next(new ErrorHandler(httpStatus.UNAUTHORIZED, error.message));
                return;
            }
            next(error);
        }
    };

    private updateUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const { userId } = req;
        const {
            firstName,
            lastName,
            email,
            role,
        }: {
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
        } = req.body;
        const userData = new UserData({ id, firstName, lastName, email, role });
        const data: UpdateUserByIdData = { userId, userData };

        try {
            const interactor = new UpdateUserByIdInteractor(this.userService);
            const result = await interactor.execute(data);
            const updatedUser = UserViewModel.fromData(result);
            res.status(httpStatus.OK).json({ success: true, data: updatedUser });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
            }
            if (error instanceof NotAllowError) {
                next(new ErrorHandler(httpStatus.UNAUTHORIZED, error.message));
                return;
            }
            next(new Error(error));
        }
    };

    private deleteUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const { userId } = req;
        const data: DeleteUserByIdData = { userId, userToDelete: id };

        try {
            const interactor = new DeleteUserByIdInteractor(this.userService);
            await interactor.execute(data);
            res.status(httpStatus.OK).json({ success: true });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
                return;
            }
            if (error instanceof NotAllowError) {
                next(new ErrorHandler(httpStatus.UNAUTHORIZED, error.message));
                return;
            }
            next(new Error(error));
        }
    };

    private signInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password }: { email: string; password: string } = req.body;
        const data = { email, password };

        const interactor = new SignInUserInteractor(this.userService);
        try {
            const result = await interactor.execute(data);
            const token = await generateJWTToken(result.email, result.id);

            res.status(httpStatus.OK).json({ success: true, data: token });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
                return;
            }
            if (error instanceof SignInError) {
                next(new ErrorHandler(httpStatus.UNPROCESSABLE_ENTITY, error.message));
                return;
            }
            next(new Error(error));
        }
    };

    private forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email }: { email: string } = req.body;
        const data: ForgotPasswordData = { email };

        try {
            const interactor = new ForgotPasswordInteractor(this.userService, this.emailService);
            await interactor.execute(data);
            res.status(httpStatus.OK).json({ success: true });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
                return;
            }
            next(new Error(error));
        }
    };

    private resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {
            email,
            newPassword,
            resetPasswordToken,
        }: { email: string; newPassword: string; resetPasswordToken: string } = req.body;
        const data: ResetPasswordData = { email, newPassword, resetPasswordToken };

        try {
            const interactor = new ResetPasswordInteractor(this.userService);
            const result = await interactor.execute(data);
            res.status(httpStatus.OK).json({ success: result });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
                return;
            }
            if (error instanceof InvalidDataError) {
                next(new ErrorHandler(httpStatus.UNPROCESSABLE_ENTITY, error.message));
                return;
            }
            next(new Error(error));
        }
    };
}

export default UserController;
