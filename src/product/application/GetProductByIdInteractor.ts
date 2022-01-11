import Interactor from "../../shared/Interactor";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

interface GetProductByIdData {
    productId: string;
}

class GetProductByIdInteractor implements Interactor {
    private data: GetProductByIdData;

    private productService: ProductService;

    constructor(data: GetProductByIdData, productService: ProductService) {
        this.data = data;
        this.productService = productService;
    }

    public async execute(): Promise<ProductData> | null {
        // TODO: Validate

        const product = await this.productService.getProductById(this.data.productId);

        return product ? ProductData.fromModel(product) : null;
    }
}

export type { GetProductByIdData };
export default GetProductByIdInteractor;
