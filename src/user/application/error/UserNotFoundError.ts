import NotFoundError from "../../../shared/error/BaseNotFoundError";

class UserNotFoundError extends NotFoundError {
    constructor() {
        const ERROR_CODE = "nf-1";
        const messageToRender = "error.user_not_found";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, ERROR_CODE);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default UserNotFoundError;
