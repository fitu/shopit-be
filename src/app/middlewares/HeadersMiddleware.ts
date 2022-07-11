import { Application } from "express";
import helmet from "helmet";

import Middleware from "../../shared/middlewares/Middleware";

class HeadersMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        app.use(helmet());
    }
}

export default HeadersMiddleware;
