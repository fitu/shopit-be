import BaseError, { ErrorCodes } from "@shared/error/BaseError";

class BaseNotFoundError extends BaseError {
    constructor(message?: string, details?: string, code?: string) {
        const errorCode = code || ErrorCodes.NOT_FOUND.toString();
        const messageToRender = message || "error.not_found";
        const detailsToRender = details || "";

        super({ code: errorCode, message: messageToRender, details: detailsToRender });

        Error.captureStackTrace(this, this.constructor);
    }
}

export default BaseNotFoundError;
