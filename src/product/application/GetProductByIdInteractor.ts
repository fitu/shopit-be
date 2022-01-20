import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

interface GetProductByIdData {
    productId: string;
}

class GetProductByIdInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute(data: GetProductByIdData): Promise<ProductData> {
        // TODO: Validate

        const product = await this.productService.getProductById(data.productId);

        // TODO: throw exception if fails
        return ProductData.fromModel(product);
    }
}

export type { GetProductByIdData };
export default GetProductByIdInteractor;
