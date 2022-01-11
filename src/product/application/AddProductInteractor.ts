import Interactor from "../../shared/Interactor";
import Product from "../domain/Product";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

interface AddProductData {
    productData: ProductData;
    userId: string;
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

        const newProduct = new Product({
            id: '56f2a3e0-37fa-4cdb-91a7-f6194299432a', // TODO: remove hardcoded
            title: this.data.productData.title,
            description: this.data.productData.description,
            price: this.data.productData.price,
            ratings: this.data.productData.ratings,
            imageUrl: this.data.productData.imageUrl,
            category: this.data.productData.category,
            stock: this.data.productData.stock,
        });
        const createdProduct = await this.productService.create(newProduct, this.data.userId);

        return ProductData.fromModel(createdProduct);
    }
}

export type { AddProductData };
export default AddProductInteractor;
