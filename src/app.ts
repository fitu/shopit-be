import express, { Application } from "express";
import path from "path";
import session from "express-session";

import { handleAppErrors } from "./shared/error/errorController";
import { handleGeneralErrors } from "./shared/error/errors";
import Controller from "./shared/Controller";
import Database from "./shared/db/database";

const BASE_VERSION = "/api/v1";

class App {
    private app: Application;
    private env: any;
    private db: Database;

    constructor(env: any, db: Database, controllers: Controller[]) {
        this.app = express();

        this.env = env;
        this.db = db;

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
        this.app.use(
            session({
                secret: this.env.KEY_SESSIONS_SECRET,
                store: this.db.getSessionStore(),
                resave: false,
                saveUninitialized: false,
            })
        );
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
