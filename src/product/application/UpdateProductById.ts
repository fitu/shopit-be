import Interactor from "../../shared/Interactor";
import ProductService from "../domain/ProductService";
import Product from "../domain/Product";

import ProductData from "./ProductData";

interface UpdateProductByIdData {
    productId: string;
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
        const productToUpdate = new Product({
            id: '56f2a3e0-37fa-4cdb-91a7-f6194299432a', // TODO: remove hardcoded
            title: this.data.productData.title,
            description: this.data.productData.description,
            price: this.data.productData.price,
            ratings: this.data.productData.ratings,
            imageUrl: this.data.productData.imageUrl,
            category: this.data.productData.category,
            stock: this.data.productData.stock,
        });

        const product = await this.productService.updateProductById(this.data.productId, productToUpdate);

        return product ? ProductData.fromModel(product) : null;
    }
}

export type { UpdateProductByIdData };
export default UpdateProductByIdInteractor;
