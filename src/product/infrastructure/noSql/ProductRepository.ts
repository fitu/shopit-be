import Product from "../../domain/Product";
import { Repository } from "../Repository";

class ProductRepository implements Repository {
    public async save(product: Product, userId: number): Promise<Product> {
        return new Promise(() => {});
    }

    public async saveBulk(products: Array<Product>, userIds: Array<number>): Promise<Array<Product>> {
        return new Promise(() => {});
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
