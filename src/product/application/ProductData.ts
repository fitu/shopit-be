import Product, { ProductCategory } from "../domain/Product";

class ProductData {
    constructor(
        public title: string,
        public description: string | null,
        public price: number,
        public imageUrl: string,
        public category: ProductCategory,
        public stock: number,
        public id?: number,
        public ratings: number = 0
    ) {}

    public static fromModel(product: Product): ProductData {
        return new ProductData(
            product.title,
            product.description,
            product.price,
            product.imageUrl,
            product.category,
            product.stock,
            product.id,
            product.ratings
        );
    }
}

export default ProductData;
