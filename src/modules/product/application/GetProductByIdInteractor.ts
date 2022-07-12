import ProductService from "@product/domain/ProductService";
import ProductNotFoundError from "@product/application/error/ProductNotFoundError";
import ProductData from "@product/application/ProductData";

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
