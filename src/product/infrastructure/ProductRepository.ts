import Product from "../domain/Product";

import ProductDao from "./ProductDao";

interface Repository {
    save: (product: Product) => Promise<Product>;
}

class ProductRepository implements Repository {
    public async save(product: Product): Promise<Product> {
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
    }

    public async getAllProductsForUser(userId: number): Promise<Array<Product>> {
        // TODO: add where for userId
        const allProducts = await ProductDao.findAll();
        return allProducts;
    }
}

export type { Repository };
export default ProductRepository;
