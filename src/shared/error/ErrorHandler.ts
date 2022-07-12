import BaseError from "@shared/error/BaseError";

class ErrorHandler extends Error {
    statusCode: number;
    errors: string | BaseError | Array<string> | Array<BaseError>;

    constructor(statusCode: number, errors: string | BaseError | Array<string> | Array<BaseError>) {
        super("");

        this.statusCode = statusCode;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { ErrorHandler };
