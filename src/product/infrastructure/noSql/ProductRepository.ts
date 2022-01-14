import { zip } from "lodash";
import { Types } from "mongoose";

import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDocument, { ProductDao } from "./ProductDao";

class ProductRepository implements Repository {
    public async save(product: Product, userId: string): Promise<Product> {
        const productToSave: ProductDao = { ...product, _id: product.id, userId: new Types.ObjectId(userId) };
        const newProduct = await ProductDocument.create(productToSave);
        return newProduct.toModel();
    }

    public async saveBulk(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsUsers: Array<[Product, string]> = zip(products, userIds);
        const productsToSave: Array<ProductDao> = productsUsers.map(([product, userId]) => ({
            ...product,
            _id: product.id,
            userId: new Types.ObjectId(userId),
        }));
        const newProducts = await ProductDocument.insertMany(productsToSave);
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
