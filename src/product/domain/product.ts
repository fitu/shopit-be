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

export type { ProductCategory };
export default Product;
