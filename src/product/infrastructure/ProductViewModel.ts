import ProductData from "../application/ProductData";
import { ProductCategory } from "../domain/Product";

class ProductViewModel {
    constructor(
        public id: string,
        public title: string,
        public description: string | null,
        public price: number,
        public imageUrl: string,
        public category: ProductCategory,
        public stock: number,
        public ratings: number
    ) {}

    public static fromData(productData: ProductData): ProductViewModel {
        return new ProductViewModel(
            productData.id,
            productData.title,
            productData.description,
            productData.price,
            productData.imageUrl,
            productData.category,
            productData.stock,
            productData.ratings
        );
    }
}

export default ProductViewModel;
