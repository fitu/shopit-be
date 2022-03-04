import fs from "fs/promises";
import path from "path";
import https from "https";
import { Server } from "http";

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { handleAppErrors } from "./shared/error/errorController";
import Controller from "./shared/Controller";
import { IMAGES_FOLDER_NAME } from "./shared/utils/imageUtils";

const BASE_VERSION = "/api/v1";

class App {
    private app: Application;
    // private io: Server;
    private controllers: Array<Controller>;

    constructor(
        // io: Server,
        controllers: Array<Controller>
    ) {
        this.app = express();
        // this.io = io;
        this.controllers = controllers;
    }

    public async init(): Promise<void> {
        await this.initializeMiddlewares();
        this.initializeControllers(this.controllers);
        this.initializeStaticResources();
        this.initializeErrorHandling();
    }

    public async listen(): Promise<Server> {
        const PRIVATE_KEY_FILE_NAME = "server.key";
        const privateKey = await fs.readFile(PRIVATE_KEY_FILE_NAME);

        const CERTIFICATE_FILE_NAME = "server.cert";
        const certificate = await fs.readFile(CERTIFICATE_FILE_NAME);

        // const server = https
        //     .createServer({ key: privateKey, cert: certificate }, this.app)
        //     .listen(process.env.PORT, () => {
        //         console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        //     });

        const server = this.app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        // this.io.attach(server);
        return server;
    }

    private initializeMiddlewares = async (): Promise<void> => {
        this.initializeParsers();
        this.initializeCORSAndHeaders();
        await this.initializeLogs();
        // TODO: check this
        // this.initializeCSRF();
    };

    private initializeParsers(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
    }

    private initializeCORSAndHeaders(): void {
        // TODO: check this
        const corsOptions = {
            origin: "*",
            credentials: true,
        };
        this.app.use(cors(corsOptions));
        this.app.use(helmet());
    }

    private async initializeLogs(): Promise<void> {
        const LOG_FOLDER_NAME = "logs";
        const LOG_FILE_NAME = "access.log";
        const logFile = await fs.open(path.join(__dirname, "..", LOG_FOLDER_NAME, LOG_FILE_NAME), "a");
        this.app.use(morgan("combined", { stream: logFile.createWriteStream() }));
    }

    private initializeCSRF(): void {
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

    private initializeControllers(controllers: Controller[]): void {
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

        // Compression
        this.app.use(compression());
    };

    private initializeErrorHandling(): void {
        this.app.use(handleAppErrors);
    }
}

export { BASE_VERSION };
export default App;
