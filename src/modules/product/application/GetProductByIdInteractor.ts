import ProductService from "@product/domain/ProductService";
import ProductNotFoundError from "@product/application/error/ProductNotFoundError";
import ProductData from "@product/application/ProductData";

type GetProductByIdData = {
    readonly productId: string;
};

class GetProductByIdInteractor {
    constructor(private readonly productService: ProductService) {}

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
