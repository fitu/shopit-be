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

    public async getAllProducts(): Promise<Array<Product>> {
        const allProducts = await ProductDao.findAll();
        return allProducts;
    }

    public async getProductById(productId: number): Promise<Product> | null {
        const product = await ProductDao.findByPk(productId);
        return product;
    }

    public async deleteProductById(productId: number): Promise<void> {
        const productToDelete = await ProductDao.findByPk(productId);
        await productToDelete.destroy();
    }

    public async updateProductById(productId: number, product: Product): Promise<Product> | null {
        const updatedProduct = await ProductDao.findByPk(productId);

        if (!updatedProduct) {
            return null;
        }

        updatedProduct.title = product.title;
        updatedProduct.description = product.description;
        updatedProduct.price = product.price;
        updatedProduct.imageUrl = product.imageUrl;
        updatedProduct.category = product.category;
        updatedProduct.stock = product.stock;
        await updatedProduct.save();

        return updatedProduct;
    }
}

export type { Repository };
export default ProductRepository;
