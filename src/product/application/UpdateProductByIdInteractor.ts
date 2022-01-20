import ProductService from "../domain/ProductService";
import Product from "../domain/Product";

import ProductData from "./ProductData";

interface UpdateProductByIdData {
    productId: string;
    productData: ProductData;
}

class UpdateProductByIdInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute(data: UpdateProductByIdData): Promise<ProductData> {
        // TODO: Validate
        const productToUpdate = new Product({
            id: data.productData.id,
            title: data.productData.title,
            description: data.productData.description,
            price: data.productData.price,
            ratings: data.productData.ratings,
            imageUrl: data.productData.imageUrl,
            category: data.productData.category,
            stock: data.productData.stock,
        });

        const product = await this.productService.updateProductById(data.productId, productToUpdate);
        
        // TODO: throw exception if fails

        return ProductData.fromModel(product);
    }
}

export type { UpdateProductByIdData };
export default UpdateProductByIdInteractor;
