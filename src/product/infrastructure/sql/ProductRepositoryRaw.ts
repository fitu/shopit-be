import Page from "../../../shared/Page";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDao from "./ProductDao";

class ProductRepositoryRaw implements Repository {
    public async create(product: Product, userId: string): Promise<Product> {
        return new Promise(() => {});
    }

    public async createBulk(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        return new Promise(() => {});
    }

    public async update(product: Product, userId: string): Promise<Product> {
        return new Promise(() => {});
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        return new Promise(() => {});
    }

    public async getProductById(productId: string): Promise<Product | null> {
        return new Promise(() => {});
    }

    public async deleteProductById(productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        return new Promise(() => {});
    }
}

export default ProductRepositoryRaw;
