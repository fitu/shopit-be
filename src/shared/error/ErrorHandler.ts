import { Server } from "http";

class ErrorHandler extends Error {
    statusCode: number;

    constructor(public message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { ErrorHandler };
