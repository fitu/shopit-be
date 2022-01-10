import { zip } from "lodash";

import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDao from "./ProductDao";

class ProductRepository implements Repository {
    public async save(product: Product, userId: number): Promise<Product> {
        const productToSave = { ...product, userId };
        const newProduct = await ProductDao.create(productToSave);
        return newProduct.toModel();
    }

    public async saveBulk(products: Array<Product>, userIds: Array<number>): Promise<Array<Product>> {
        const productsUsers: Array<[Product, number]> = zip(products, userIds);
        const productToSave = productsUsers.map(([product, userId]) => ({ ...product, userId }));
        const newProducts = await ProductDao.insertMany(productToSave);
        return newProducts.map((newProduct) => newProduct.toModel());
    }

    public async getAllProducts(): Promise<Array<Product>> {
        return new Promise(() => {});
    }

    public async getProductById(productId: number): Promise<Product> | null {
        return new Promise(() => {});
    }

    public async deleteProductById(productId: number): Promise<void> {
        return new Promise(() => {});
    }

    public async updateProductById(productId: number, product: Product): Promise<Product> | null {
        return new Promise(() => {});
    }
}

export type { Repository };
export default ProductRepository;
