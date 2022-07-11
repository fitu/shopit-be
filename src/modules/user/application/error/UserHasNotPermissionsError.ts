import BaseNotAllowError from "../../../../shared/error/BaseNotAllowError";

class UserHasNotPermissionsError extends BaseNotAllowError {
    constructor() {
        const ERROR_CODE = "na-1";
        const messageToRender = "error.user_has_not_permissions";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, ERROR_CODE);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default UserHasNotPermissionsError;
