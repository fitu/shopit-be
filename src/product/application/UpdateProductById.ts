import Interactor from "../../shared/Interactor";
import ProductService from "../domain/ProductService";
import Product from "../domain/Product";

import ProductData from "./ProductData";

interface UpdateProductByIdData {
    productId: number;
    productData: ProductData;
}

class UpdateProductByIdInteractor implements Interactor {
    private data: UpdateProductByIdData;

    private productService: ProductService;

    constructor(data: UpdateProductByIdData, productService: ProductService) {
        this.data = data;
        this.productService = productService;
    }

    public async execute(): Promise<ProductData> | null {
        // TODO: Validate
        const productToUpdate = new Product(
            1, // TODO: remove hardcoded
            this.data.productData.title,
            this.data.productData.description,
            this.data.productData.price,
            this.data.productData.ratings,
            this.data.productData.imageUrl,
            this.data.productData.category,
            this.data.productData.stock
        );

        const product = await this.productService.updateProductById(this.data.productId, productToUpdate);

        return product ? ProductData.fromModel(product) : null;
    }
}

export type { UpdateProductByIdData };
export default UpdateProductByIdInteractor;
