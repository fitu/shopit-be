import { zip } from "lodash";

import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDao from "./ProductDao";

class ProductRepository implements Repository {
    public async save(product: Product, userId: string): Promise<Product> {
        const productToSave = { ...product, userId };
        const newProduct = await ProductDao.create(productToSave);
        return newProduct.toModel();
    }

    public async saveBulk(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsUsers: Array<[Product, string]> = zip(products, userIds);
        const productsToSave = productsUsers.map(([product, userId]) => ({ ...product, userId }));
        const newProducts = await ProductDao.insertMany(productsToSave);
        return newProducts.map((newProduct) => newProduct.toModel());
    }

    public async getAllProducts(): Promise<Array<Product>> {
        return new Promise(() => {});
    }

    public async getProductById(productId: string): Promise<Product> | null {
        return new Promise(() => {});
    }

    public async deleteProductById(productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async updateProductById(productId: string, product: Product): Promise<Product> | null {
        return new Promise(() => {});
    }
}

export type { Repository };
export default ProductRepository;
