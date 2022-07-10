import BaseError from "./BaseError";

class BaseNotAllowError extends BaseError {
    constructor(message?: string, details?: string, code?: string) {
        const errorCode = code ?? "na-0";
        const messageToRender = message ?? "error.not_allow";
        const detailsToRender = details ?? "";

        super({ code: errorCode, message: messageToRender, details: detailsToRender });

        Error.captureStackTrace(this, this.constructor);
    }
}

export default BaseNotAllowError;
