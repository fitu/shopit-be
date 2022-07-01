import { isString } from "lodash";

class ErrorHandler extends Error {
    statusCode: number;
    errorMessages: string | Array<string>;

    constructor(statusCode: number, errorMessages: string | Array<string>) {
        const message = isString(errorMessages) ? errorMessages : errorMessages[0];
        super(message);

        this.statusCode = statusCode;
        this.errorMessages = errorMessages;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { ErrorHandler };
