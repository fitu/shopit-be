import Product from "../domain/Product";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

interface CreateProductData {
    productData: ProductData;
    userId: string;
}

class CreateProductInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute(data: CreateProductData): Promise<ProductData> {
        const newProduct = new Product({
            title: data.productData.title,
            description: data.productData.description,
            price: data.productData.price,
            ratings: data.productData.ratings,
            imageUrl: data.productData.imageUrl,
            category: data.productData.category,
            stock: data.productData.stock,
        });
        const createdProduct = await this.productService.create(newProduct, data.userId);

        return ProductData.fromModel(createdProduct);
    }
}

export type { CreateProductData };
export default CreateProductInteractor;
