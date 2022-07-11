import path from "path";

import express, { Application } from "express";
import compression from "compression";

import { IMAGES_FOLDER_NAME } from "../../shared/utils/imageUtils";
import Middleware from "../../shared/middlewares/Middleware";

class StaticResourcesMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        // Static files
        const STATICS_FOLDER_NAME = "public";
        app.use(express.static(path.join(__dirname, STATICS_FOLDER_NAME)));

        // Images
        const PATH_URL_FOR_IMAGES = "images";
        app.use(PATH_URL_FOR_IMAGES, express.static(path.join(__dirname, IMAGES_FOLDER_NAME)));

        // Compression
        app.use(compression());
    }
}

export default StaticResourcesMiddleware;
