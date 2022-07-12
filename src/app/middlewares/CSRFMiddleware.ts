import { Application, Request, Response, NextFunction } from "express";
import csrf from "csurf";

import Middleware from "@shared/middlewares/Middleware";

class CSRFMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        const cookieExpirationInSeconds = 60 * 60;
        const csrfOptions = {
            cookie: {
                key: "_csrf",
                secure: false,
                maxAge: cookieExpirationInSeconds,
                httpOnly: true,
            },
        };

        app.use(csrf(csrfOptions));

        app.use((req: Request, res: Response, next: NextFunction): void => {
            if (req.method === "GET") {
                res.cookie("XSRF-TOKEN", req.csrfToken());
            }
            next();
        });
    }
}

export default CSRFMiddleware;
