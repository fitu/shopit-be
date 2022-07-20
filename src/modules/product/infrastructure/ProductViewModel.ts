import ProductData from "@product/application/ProductData";
import { ProductCategory } from "@product/domain/Product";

class ProductViewModel {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly price: number;
    readonly imageUrl: string;
    readonly category: ProductCategory;
    readonly stock: number;
    readonly ratings: number;

    constructor({
        id,
        title,
        description,
        price,
        imageUrl,
        category,
        stock,
        ratings,
    }: {
        id: string;
        title: string;
        description: string;
        price: number;
        imageUrl: string;
        category: ProductCategory;
        stock: number;
        ratings: number;
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.stock = stock;
        this.ratings = ratings;
    }

    public static fromData(productData: ProductData): ProductViewModel {
        const productViewModel = new ProductViewModel({
            id: productData.id,
            title: productData.title,
            description: productData.description,
            price: productData.price,
            imageUrl: productData.imageUrl,
            category: productData.category,
            stock: productData.stock,
            ratings: productData.ratings,
        });

        return productViewModel;
    }
}

export default ProductViewModel;
