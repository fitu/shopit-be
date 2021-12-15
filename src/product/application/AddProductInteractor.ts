import Interactor from "../../shared/Interactor";
import Product from "../domain/Product";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

interface AddProductData {
    data: ProductData;
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
            this.data.data.title,
            this.data.data.description,
            this.data.data.price,
            this.data.data.ratings,
            this.data.data.imageUrl,
            this.data.data.category,
            this.data.data.stock
        );
        const createdProduct = await this.productService.create(newProduct, this.data.userId);

        return ProductData.fromModel(createdProduct);
    }
}

export type { AddProductData };
export default AddProductInteractor;
