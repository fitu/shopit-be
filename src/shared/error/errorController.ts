import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { isString } from "lodash";

import BaseError, { ErrorCodes } from "@shared/error/BaseError";
import { ErrorHandler } from "@shared/error/ErrorHandler";

// TODO: use another file for production, not env vars
const handleAppErrors = (err: ErrorHandler, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const errors = parseErrors(req, err.errors);
    const withStackIfRequired = process.env.NODE_ENV === "DEVELOPMENT" ? { stack: err.stack } : {};

    res.status(statusCode).json({
        success: false,
        errors,
        ...withStackIfRequired,
    });
};

const parseErrors = (req: Request, errors: string | BaseError | Array<string> | Array<BaseError>): Array<BaseError> => {
    if (isString(errors)) {
        return [parseString(req, errors)];
    }

    if (errors instanceof BaseError) {
        return [parseBaseError(req, errors)];
    }

    const translatedErrors = errors.map((error) =>
        isString(error) ? parseString(req, error) : parseBaseError(req, error)
    );

    return translatedErrors;
};

const parseString = (req: Request, error: string): BaseError => {
    const errorMessage = error || "error.internal_server";

    // FIXME: tests are falling because of this t. This is a workaround
    let translatedErrorMessage;
    try {
        translatedErrorMessage = req.t(errorMessage);
    } catch (error: any) {
        translatedErrorMessage = errorMessage;
    }

    const translatedError = new BaseError({
        code: ErrorCodes.UNKNOWN.toString(),
        message: translatedErrorMessage,
        details: "",
    });

    return translatedError;
};

const parseBaseError = (req: Request, error: BaseError): BaseError => {
    const { code, message, details } = error;
    const errorMessage = message || "error.internal_server";

    // FIXME: tests are falling because of this t. This is a workaround
    let translatedErrorMessage;
    try {
        translatedErrorMessage = req.t(errorMessage);
    } catch (error: any) {
        translatedErrorMessage = errorMessage;
    }

    const translatedError = new BaseError({
        code,
        message: translatedErrorMessage,
        details,
    });

    return translatedError;
};

export { handleAppErrors };
