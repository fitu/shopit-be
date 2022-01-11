import Interactor from "../../shared/Interactor";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

interface DeleteProductByIdData {
    productId: string;
}

class DeleteProductByIdInteractor implements Interactor {
    private data: DeleteProductByIdData;

    private productService: ProductService;

    constructor(data: DeleteProductByIdData, productService: ProductService) {
        this.data = data;
        this.productService = productService;
    }

    public async execute(): Promise<void> {
        // TODO: Validate

        await this.productService.deleteProductById(this.data.productId);
    }
}

export type { DeleteProductByIdData };
export default DeleteProductByIdInteractor;
