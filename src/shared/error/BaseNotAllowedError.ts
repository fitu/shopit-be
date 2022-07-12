import BaseError, { ErrorCodes } from "@shared/error/BaseError";

class BaseNotAllowedError extends BaseError {
    constructor(message?: string, details?: string, code?: string) {
        const errorCode = code || ErrorCodes.NOT_ALLOWED.toString();
        const messageToRender = message || "error.not_allowed";
        const detailsToRender = details || "";

        super({ code: errorCode, message: messageToRender, details: detailsToRender });

        Error.captureStackTrace(this, this.constructor);
    }
}

export default BaseNotAllowedError;
