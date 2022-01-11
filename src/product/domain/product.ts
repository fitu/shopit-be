type ProductCategory =
    | "Electronics"
    | "Cameras"
    | "Laptops"
    | "Accessories"
    | "Headphones"
    | "Food"
    | "Books"
    | "Clothes/Shoes"
    | "Beauty/Health"
    | "Sports"
    | "Outdoor"
    | "Home";

class Product {
    readonly id: string;
    readonly title: string;
    readonly description: string | null;
    readonly price: number;
    readonly ratings: number;
    readonly imageUrl: string;
    readonly category: ProductCategory;
    readonly stock: number;

    constructor({
        id,
        title,
        description,
        price,
        ratings,
        imageUrl,
        category,
        stock,
    }: {
        id: string;
        title: string;
        description: string | null;
        price: number;
        ratings: number;
        imageUrl: string;
        category: ProductCategory;
        stock: number;
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.ratings = ratings;
        this.imageUrl = imageUrl;
        this.category = category;
        this.stock = stock;
    }
}

export type { ProductCategory };
export default Product;
