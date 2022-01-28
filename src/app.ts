import { Server } from "http";
import express, { Application, Request } from "express";
import path from "path";
import cors from "cors";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import session from "express-session";

import { handleAppErrors } from "./shared/error/errorController";
import Controller from "./shared/Controller";
import Database from "./shared/db/database";
import { IMAGES_FOLDER_NAME } from "./shared/utils/imageUtils";

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

        this.handleErrors(server);
    }

    private handleErrors(server: Server): void {
        process.on("uncaughtException", (err: Error) => {
            console.log(`Error; ${err.message}`);
            console.log(`Shutting down the server due to Uncaught exception`);
            server.close(() => process.exit(1));
        });

        process.on("unhandledRejection", (err: Error): void => {
            console.log(`Error; ${err.message}`);
            console.log(`Shutting down the server due to Unhandled promise rejection`);
            server.close(() => process.exit(1));
        });
    }

    private initializeMiddlewares = (): void => {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        // TODO: check this
        const corsOptions = {
            origin: "*",
            credentials: true,
        };
        this.app.use(cors(corsOptions));

        this.app.use(cookieParser());

        this.app.use(
            session({
                secret: this.env.KEY_SESSIONS_SECRET,
                store: this.db.getSessionStore(),
                resave: false,
                saveUninitialized: false,
                cookie: { httpOnly: true },
            })
        );
        this.db.syncStore();

        const csrfOptions = {
            cookie: false,

            // TODO: use this cookie instead of session?
            // cookie: {
            //     key: "_csrf",
            //     secure: false,
            //     maxAge: 60 * 60, // 1 hour
            //     httpOnly: true,
            // },

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
        };
        // TODO: turn on CSFR
        // this.app.use(csrf(csrfOptions));
    };

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
