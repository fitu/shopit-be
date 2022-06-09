import ProductService from "../domain/ProductService";

interface DeleteProductByIdData {
    productId: string;
}

class DeleteProductByIdInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute(data: DeleteProductByIdData): Promise<void> {
        // TODO: Validate id and user
        await this.productService.deleteProductById(data.productId);
    }
}

export type { DeleteProductByIdData };
export default DeleteProductByIdInteractor;
