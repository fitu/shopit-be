import fs from "fs/promises";
import https from "https";
import { Server } from "http";

import express, { Application } from "express";

import { handleAppErrors } from "../shared/error/errorController";
import Middleware from "../shared/middlewares/Middleware";
import Controller from "../shared/controllers/Controller";

const BASE_VERSION = "/api/v1";

class App {
    private app: Application;
    // private io: Server;
    private controllers: Array<Controller>;
    private middlewares: Array<Middleware>;

    constructor(
        // io: Server,
        controllers: Array<Controller>,
        middlewares: Array<Middleware>
    ) {
        this.app = express();
        // this.io = io;
        this.controllers = controllers;
        this.middlewares = middlewares;
    }

    public async init(): Promise<void> {
        await this.initializeMiddlewares();
        this.initializeControllers();
    }

    private initializeMiddlewares = async (): Promise<void> => {
        const middlewarePromises = this.middlewares.map(async (middleware) => {
            return middleware.init(this.app);
        });

        await Promise.all(middlewarePromises);
    };

    private initializeControllers(): void {
        this.controllers.forEach((controller) => {
            this.app.use(BASE_VERSION, controller.router);
        });
        this.app.use(handleAppErrors);
    }

    public async listen(isVerbose = true): Promise<Server> {
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
            isVerbose && console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        // this.io.attach(server);
        return server;
    }
}

export { BASE_VERSION };
export default App;
