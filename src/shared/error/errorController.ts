import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { ErrorHandler } from "./ErrorHandler";

const handleAppErrors = (err: ErrorHandler, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = (err.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR);
    // TODO: check multiple error messages
    const translatedErrorMessage = err.message ? "error.internal_server" : req.t(err.message);

    res.status(statusCode).json({
        success: false,
        message: translatedErrorMessage,
        errors: err.errorMessages,
        // TODO: use another file for production, not env vars
        ...(process.env.NODE_ENV === "DEVELOPMENT" && { stack: err.stack }),
    });
};

export { handleAppErrors };
