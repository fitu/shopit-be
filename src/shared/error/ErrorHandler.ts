class ErrorHandler extends Error {
    statusCode: number;
    errors: string | Array<string>;

    constructor(public message: string, statusCode: number, errors: string | Array<string>) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { ErrorHandler };
