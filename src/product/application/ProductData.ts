import Product, { ProductCategory } from "../domain/Product";

class ProductData {
    readonly id?: string;
    readonly title: string;
    readonly description: string | null;
    readonly price: number;
    readonly imageUrl: string;
    readonly category: ProductCategory;
    readonly stock: number;
    readonly ratings?: number;

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
        id?: string | null;
        title: string;
        description: string | null;
        price: number;
        imageUrl: string;
        category: ProductCategory;
        stock: number;
        ratings?: number;
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.stock = stock;
        this.ratings = ratings ?? 0;
    }

    public static fromModel(product: Product): ProductData {
        return new ProductData({
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
            ratings: product.ratings,
        });
    }
}

export default ProductData;
