import { ErrorCodes } from "../../../../shared/error/BaseError";
import NotFoundError from "../../../../shared/error/BaseNotFoundError";

class ProductNotFoundError extends NotFoundError {
    constructor() {
        const errorCode = ErrorCodes.PRODUCT_NOT_FOUND.toString();
        const messageToRender = "error.product_not_found";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, errorCode);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ProductNotFoundError;
