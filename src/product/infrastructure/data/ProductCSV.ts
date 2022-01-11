import Product, { ProductCategory } from "../../domain/Product";

class ProductCSV {
    constructor(
        public id: string,
        public title: string,
        public description: string | null,
        public price: number,
        public ratings: number,
        public imageUrl: string,
        public category: ProductCategory,
        public stock: number,
        public userId: string
    ) {}

    static toModel(productCSV: ProductCSV): Product {
        return {
            id: productCSV.id,
            title: productCSV.title,
            description: productCSV.description,
            price: productCSV.price,
            ratings: productCSV.ratings,
            // TODO: improve this with array of images
            imageUrl: productCSV["images/0/url"],
            category: productCSV.category,
            stock: productCSV.stock,
        };
    }
}

export default ProductCSV;
