import Product from "../domain/Product";

import ProductDao from "./ProductDao";

interface Repository {
    save: (product: Product) => Promise<Product>;
}

class ProductRepository implements Repository {
    public save = async (product: Product): Promise<Product> => {
        const newProduct = await ProductDao.create({
            title: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            ratings: product.ratings,
            category: product.category,
            stock: product.stock,
        });

        return newProduct;
    };
}

export type { Repository };
export default ProductRepository;
