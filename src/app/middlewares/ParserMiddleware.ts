import express, { Application } from "express";
import cookieParser from "cookie-parser";

import Middleware from "../../shared/middlewares/Middleware";

class ParserMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
    }
}

export default ParserMiddleware;
