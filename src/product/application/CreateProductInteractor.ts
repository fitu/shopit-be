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

    public async execute({ productData, userId }: CreateProductData): Promise<ProductData> {
        const newProduct = new Product({
            title: productData.title,
            description: productData.description,
            price: productData.price,
            ratings: productData.ratings,
            imageUrl: productData.imageUrl,
            category: productData.category,
            stock: productData.stock,
        });
        const createdProduct = await this.productService.create(newProduct, userId);

        return ProductData.fromModel(createdProduct);
    }
}

export type { CreateProductData };
export default CreateProductInteractor;
