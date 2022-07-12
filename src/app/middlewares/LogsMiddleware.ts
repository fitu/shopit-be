import fs from "fs/promises";
import path from "path";

import { Application } from "express";
import morgan from "morgan";

import Middleware from "@shared/middlewares/Middleware";

class LogsMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        const LOG_FOLDER_NAME = "logs";
        const LOG_FILE_NAME = "access.log";

        const logFile = await fs.open(path.join(__dirname, "..", "..", "..", LOG_FOLDER_NAME, LOG_FILE_NAME), "a");

        app.use(morgan("combined", { stream: logFile.createWriteStream() }));
    }
}

export default LogsMiddleware;
