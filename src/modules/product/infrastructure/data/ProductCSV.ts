import Product, { ProductCategory } from "@product/domain/Product";

class ProductCSV {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public price: number,
        public ratings: number,
        public imageUrl: string,
        public category: ProductCategory,
        public stock: number,
        public userId: string
    ) {}

    static toModel(productCSV: ProductCSV): Product {
        const product = new Product({
            id: productCSV.id,
            title: productCSV.title,
            description: productCSV.description,
            price: productCSV.price,
            ratings: productCSV.ratings,
            // TODO: improve this with array of images
            imageUrl: productCSV["images/0/url"],
            category: productCSV.category,
            stock: productCSV.stock,
        });

        return product;
    }
}

export default ProductCSV;
