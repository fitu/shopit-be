import Interactor from "../../shared/Interactor";
import Product from "../domain/Product";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

interface AddProductData {
    productData: ProductData;
    userId: number;
}

class AddProductInteractor implements Interactor {
    private data: AddProductData;

    private productService: ProductService;

    constructor(data: AddProductData, productService: ProductService) {
        this.data = data;
        this.productService = productService;
    }

    public async execute(): Promise<ProductData> {
        // TODO: Validate

        const newProduct = new Product(
            1, // TODO: remove hardcoded
            this.data.productData.title,
            this.data.productData.description,
            this.data.productData.price,
            this.data.productData.ratings,
            this.data.productData.imageUrl,
            this.data.productData.category,
            this.data.productData.stock
        );
        const createdProduct = await this.productService.create(newProduct, this.data.userId);

        return ProductData.fromModel(createdProduct);
    }
}

export type { AddProductData };
export default AddProductInteractor;
