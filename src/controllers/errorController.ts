import { Request, Response, NextFunction } from "express";

import { ErrorHandler } from "../utils/errors";

const handleAppErrors = (err: ErrorHandler, req: Request, res: Response, next: NextFunction): void => {
    err.statusCode = err.statusCode || 500;

    // TODO: use another file for production, not env vars
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err,
            stack: err.stack,
        });
        return;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message || "Internal server error",
    });
};

export { handleAppErrors };
