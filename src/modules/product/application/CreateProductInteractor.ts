import Product from "@product/domain/Product";
import ProductService from "@product/domain/ProductService";
import ProductData from "@product/application/ProductData";

type CreateProductData = {
    readonly productData: ProductData;
    readonly userId: string;
};

class CreateProductInteractor {
    constructor(private readonly productService: ProductService) {}

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
        const createdProduct = await this.productService.insert(newProduct, userId);

        return ProductData.fromModel(createdProduct);
    }
}

export type { CreateProductData };
export default CreateProductInteractor;
