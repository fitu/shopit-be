import { zip } from "lodash";
import mongoose, { Types } from "mongoose";

import Page from "../../../shared/Page";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDocument, { ProductDao } from "./ProductDao";

class ProductRepositoryRaw implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        return new Promise(() => {});
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        return new Promise(() => {});
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        return new Promise(() => {});
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        return new Promise(() => {});
    }

    public async getProductById(productId: string): Promise<Product | null> {
        return new Promise(() => {});
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        return new Promise(() => {});
    };

    public async deleteProductById(productId: string): Promise<boolean> {
        return new Promise(() => {});
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        return new Promise(() => {});
    }
}

export default ProductRepositoryRaw;
