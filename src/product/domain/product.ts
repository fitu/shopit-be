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

interface ProductAttributes {
    id: number;
    title: string;
    description: string | null;
    price: number;
    ratings: number;
    imageUrl: string;
    category: ProductCategory;
    stock: number;
}

class Product implements ProductAttributes {
    constructor(
        public id: number,
        public title: string,
        public description: string | null,
        public price: number,
        public ratings: number,
        public imageUrl: string,
        public category: ProductCategory,
        public stock: number
    ) {}
}

export type { ProductCategory, ProductAttributes };
export default Product;
