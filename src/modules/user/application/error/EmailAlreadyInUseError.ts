import { ErrorCodes } from "@shared/error/BaseError";
import BaseNotAllowedError from "@shared/error/BaseNotAllowedError";

class EmailAlreadyInUseError extends BaseNotAllowedError {
    constructor() {
        const errorCode = ErrorCodes.EMAIL_ALREADY_IN_USE.toString();
        const messageToRender = "error.error.email_already_in_use";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, errorCode);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default EmailAlreadyInUseError;
