import NotFoundError from "../../shared/error/NotFoundError";
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

    public async execute({ productId }: GetProductByIdData): Promise<ProductData> {
        const product = await this.productService.getProductById(productId);

        if (!product) {
            // TODO: remove hardcoded
            throw new NotFoundError("Product not found");
        }

        return ProductData.fromModel(product);
    }
}

export type { GetProductByIdData };
export default GetProductByIdInteractor;
