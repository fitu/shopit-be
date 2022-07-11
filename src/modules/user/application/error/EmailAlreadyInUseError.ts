import BaseNotAllowError from "../../../../shared/error/BaseNotAllowError";

class EmailAlreadyInUseError extends BaseNotAllowError {
    constructor() {
        const ERROR_CODE = "na-2";
        const messageToRender = "error.error.email_already_in_use";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, ERROR_CODE);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default EmailAlreadyInUseError;
