import { Application } from "express";
import cors from "cors";

import Middleware from "@shared/middlewares/Middleware";

class CORSMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        const corsOptions = {
            origin: "*",
            credentials: true,
        };

        app.use(cors(corsOptions));
    }
}

export default CORSMiddleware;
