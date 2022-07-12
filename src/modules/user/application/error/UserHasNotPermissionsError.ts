import { ErrorCodes } from "@shared/error/BaseError";
import BaseNotAllowedError from "@shared/error/BaseNotAllowedError";

class UserHasNotPermissionsError extends BaseNotAllowedError {
    constructor() {
        const errorCode = ErrorCodes.USER_HAS_NOT_PERMISSIONS.toString();
        const messageToRender = "error.user_has_not_permissions";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, errorCode);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default UserHasNotPermissionsError;
