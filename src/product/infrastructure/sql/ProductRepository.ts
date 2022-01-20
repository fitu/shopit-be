import UserDao from "../../../user/infrastructure/sql/UserDao";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDao from "./ProductDao";

class ProductRepository implements Repository {
    public async save(product: Product, userId: string): Promise<Product> {
        const newProduct = await ProductDao.create({
            ...(product.id && { id: product.id }),
            title: product.title,
            description: product.description,
            price: product.price,
            ratings: product.ratings,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
        });

        const user = await UserDao.findByPk(userId);
        await user.setProducts([newProduct]);

        return newProduct.toModel();
    }

    public async saveBulk(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsToSave = products.map((product) => {
            return {
                ...(product.id && { id: product.id }),
                title: product.title,
                description: product.description,
                price: +product.price,
                ratings: +product.ratings,
                imageUrl: product.imageUrl,
                category: product.category,
                stock: +product.stock,
            };
        });

        const newProducts = await ProductDao.bulkCreate(productsToSave);

        const usersWithProductsPromises = userIds.map(async (userId, index) => {
            const user = await UserDao.findByPk(userId);
            await user.setProducts([newProducts[index]]);
        });
        await Promise.all(usersWithProductsPromises);

        return newProducts.map((newProduct) => newProduct.toModel());
    }

    public async getAllProducts(): Promise<Array<Product>> {
        const allProducts = await ProductDao.findAll();
        return allProducts;
    }

    public async getProductById(productId: string): Promise<Product> {
        const product = await ProductDao.findByPk(productId);
        return product;
    }

    public async deleteProductById(productId: string): Promise<void> {
        const productToDelete = await ProductDao.findByPk(productId);
        await productToDelete.destroy();
    }

    public async updateProductById(productId: string, product: Product): Promise<Product> {
        const updatedProduct = await ProductDao.findByPk(productId);

        if (!updatedProduct) {
            return null;
        }

        updatedProduct.update({
            title: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
        });

        return updatedProduct;
    }
}

export type { Repository };
export default ProductRepository;
