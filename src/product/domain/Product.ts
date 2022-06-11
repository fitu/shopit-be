import User from "../../user/domain/User";

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
    readonly id?: string;
    readonly title: string;
    readonly description: string;
    readonly price: number;
    readonly ratings: number;
    readonly imageUrl: string;
    readonly category: ProductCategory;
    readonly stock: number;
    readonly user?: User;

    constructor({
        id,
        title,
        description,
        price,
        ratings,
        imageUrl,
        category,
        stock,
        user
    }: {
        id?: string;
        title: string;
        description: string;
        price: number;
        ratings: number;
        imageUrl: string;
        category: ProductCategory;
        stock: number;
        user?: User;
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.ratings = ratings;
        this.imageUrl = imageUrl;
        this.category = category;
        this.stock = stock;
        this.user = user;
    }
}

export type { ProductCategory };
export default Product;
