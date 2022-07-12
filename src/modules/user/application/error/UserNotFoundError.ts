import { ErrorCodes } from "@shared/error/BaseError";
import NotFoundError from "@shared/error/BaseNotFoundError";

class UserNotFoundError extends NotFoundError {
    constructor() {
        const errorCode = ErrorCodes.USER_NOT_FOUND.toString();
        const messageToRender = "error.user_not_found";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, errorCode);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default UserNotFoundError;
