import ProductService from "../domain/ProductService";
import ProductNotFoundError from "./error/ProductNotFoundError";

import ProductData from "./ProductData";

interface GetProductByIdData {
    productId: string;
}

class GetProductByIdInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute({ productId }: GetProductByIdData): Promise<ProductData> {
        const product = await this.productService.getProductById(productId);

        if (!product) {
            throw new ProductNotFoundError();
        }

        return ProductData.fromModel(product);
    }
}

export type { GetProductByIdData };
export default GetProductByIdInteractor;
