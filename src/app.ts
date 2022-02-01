import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import csrf from "csurf";
import cookieParser from "cookie-parser";

import { handleAppErrors } from "./shared/error/errorController";
import Controller from "./shared/Controller";
import { IMAGES_FOLDER_NAME } from "./shared/utils/imageUtils";

const BASE_VERSION = "/api/v1";

class App {
    private app: Application;
    private env: any;

    constructor(env: any, controllers: Controller[]) {
        this.app = express();

        this.env = env;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeStaticResources();
        this.initializeErrorHandling();
    }

    public getServer(): Application {
        return this.app;
    }

    public listen(): void {
        const server = this.app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });
    }

    private initializeMiddlewares = (): void => {
        this.initializeParsers();
        this.initializeCORS();
        this.initializeCSRF();
    };

    private initializeParsers() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
    }

    private initializeCORS() {
        // TODO: check this
        const corsOptions = {
            origin: "*",
            credentials: true,
        };
        this.app.use(cors(corsOptions));
    }

    private initializeCSRF() {
        const cookieExpirationInSeconds = 60 * 60;
        const csrfOptions = {
            cookie: {
                key: "_csrf",
                secure: false,
                maxAge: cookieExpirationInSeconds,
                httpOnly: true,
            },
        };

        this.app.use(csrf(csrfOptions));
        this.app.use((req: Request, res: Response, next: NextFunction): void => {
            if (req.method === "GET") {
                res.cookie("XSRF-TOKEN", req.csrfToken());
            }
            next();
        });
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(BASE_VERSION, controller.router);
        });
    }

    private initializeStaticResources = (): void => {
        // Static files
        const STATICS_FOLDER_NAME = "public";
        this.app.use(express.static(path.join(__dirname, STATICS_FOLDER_NAME)));

        // Images
        const PATH_URL_FOR_IMAGES = "/images";
        this.app.use(PATH_URL_FOR_IMAGES, express.static(path.join(__dirname, IMAGES_FOLDER_NAME)));
    };

    private initializeErrorHandling(): void {
        this.app.use(handleAppErrors);
    }
}

export default App;
