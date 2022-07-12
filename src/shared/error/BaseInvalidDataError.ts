import BaseError, { ErrorCodes } from "@shared/error/BaseError";

class BaseInvalidDataError extends BaseError {
    constructor(message?: string, details?: string, code?: string) {
        const errorCode = code || ErrorCodes.INVALID_DATA.toString();
        const messageToRender = message || "error.invalid_data";
        const detailsToRender = details || "";

        super({ code: errorCode, message: messageToRender, details: detailsToRender });

        Error.captureStackTrace(this, this.constructor);
    }
}

export default BaseInvalidDataError;
