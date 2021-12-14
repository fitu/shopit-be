import express, { Application } from "express";
import path from "path";

import { handleAppErrors } from "./shared/error/errorController";
import { handleGeneralErrors } from "./shared/error/errors";
import Controller from "./shared/Controller";

const BASE_VERSION = "/api/v1";

class App {
    private app: Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.initializeStaticResources();
    }

    public getServer(): Application {
        return this.app;
    }

    public listen(): void {
        const server = this.app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        handleGeneralErrors(server);
    }

    private initializeMiddlewares = (): void => {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    };

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(BASE_VERSION, controller.router);
        });
    }

    private initializeErrorHandling(): void {
        this.app.use(handleAppErrors);
    }

    private initializeStaticResources = (): void => {
        this.app.use(express.static(path.join(__dirname, "public")));
    };
}

export default App;
