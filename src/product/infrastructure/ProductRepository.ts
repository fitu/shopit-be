import { cpSync } from "fs";
import UserDao from "../../user/infrastructure/UserDao";
import Product from "../domain/Product";

import ProductDao from "./ProductDao";

interface Repository {
    save: (product: Product, userId: number) => Promise<Product>;
    saveBulk: (products: Array<Product>, userIds: Array<number>) => Promise<Array<Product>>;
    getAllProducts: () => Promise<Array<Product>>;
    getProductById: (productId: number) => Promise<Product> | null;
    deleteProductById: (productId: number) => Promise<void>;
    updateProductById: (productId: number, product: Product) => Promise<Product> | null;
}

class ProductRepository implements Repository {
    public async save(product: Product, userId: number): Promise<Product> {
        const newProduct = await ProductDao.create({
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

    public async saveBulk(products: Array<Product>, userIds: Array<number>): Promise<Array<Product>> {
        const productsToSave = products.map((product) => {
            return {
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
            return await user.setProducts([newProducts[index]]);
        });
        await Promise.all(usersWithProductsPromises);

        return newProducts.map((newProduct) => newProduct.toModel());
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
