import NotFoundError from "../../../../shared/error/BaseNotFoundError";

class ProductNotFoundError extends NotFoundError {
    constructor() {
        const ERROR_CODE = "nf-2";
        const messageToRender = "error.product_not_found";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, ERROR_CODE);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ProductNotFoundError;
