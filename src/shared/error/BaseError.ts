class BaseError extends Error {
    readonly code: string;
    readonly message: string;
    readonly details: string;

    constructor({ code, message, details }: { code: string; message: string; details: string }) {
        super(message);

        this.code = code;
        this.message = message;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default BaseError;
