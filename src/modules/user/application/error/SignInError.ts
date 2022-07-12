import BaseError, { ErrorCodes } from "@shared/error/BaseError";

class SignInError extends BaseError {
    constructor(message?: string, details?: string) {
        const errorCode = ErrorCodes.SIGN_IN.toString();
        const messageToRender = message || "error.sign_in";
        const detailsToRender = details || "";

        super({ code: errorCode, message: messageToRender, details: detailsToRender });

        Error.captureStackTrace(this, this.constructor);
    }
}

export default SignInError;
