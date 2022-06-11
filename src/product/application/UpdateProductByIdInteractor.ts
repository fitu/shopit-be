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

    public async execute({ productId, productData }: UpdateProductByIdData): Promise<ProductData> {
        // TODO: Validate
        const productToUpdate = new Product({
            id: productData.id,
            title: productData.title,
            description: productData.description,
            price: productData.price,
            ratings: productData.ratings,
            imageUrl: productData.imageUrl,
            category: productData.category,
            stock: productData.stock,
        });

        const product = await this.productService.updateProductById(productId, productToUpdate);

        // TODO: throw exception if fails

        return ProductData.fromModel(product);
    }
}

export type { UpdateProductByIdData };
export default UpdateProductByIdInteractor;
