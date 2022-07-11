enum ErrorCodes {
    UNKNOWN = "",

    NOT_FOUND = "nf-0",
    USER_NOT_FOUND = "nf-1",
    PRODUCT_NOT_FOUND = "nf-2",

    NOT_ALLOWED = "na-0",
    USER_HAS_NOT_PERMISSIONS = "na-1",
    EMAIL_ALREADY_IN_USE = "na-2",

    INVALID_DATA = "id-0",

    SIGN_IN = "auth-0",
}

class BaseError {
    readonly code: string;
    readonly message: string;
    readonly details: string;

    constructor({ code, message, details }: { code: string; message: string; details: string }) {
        this.code = code;
        this.message = message;
        this.details = details;
    }
}

export { ErrorCodes };
export default BaseError;
