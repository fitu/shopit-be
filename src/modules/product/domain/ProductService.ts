import { Server } from "socket.io";

import Page from "../../../shared/Page";
import ProductNotFoundError from "../application/error/ProductNotFoundError";
import { Repository as ProductRepository } from "../infrastructure/Repository";

import Product from "./Product";

class ProductService {
    // private io: Server;
    private productRepository: ProductRepository;

    constructor(
        // io: Server,
        productRepository: ProductRepository
    ) {
        // this.io = io;
        this.productRepository = productRepository;
    }

    public async insert(product: Product, userId: string): Promise<Product> {
        const newProduct = await this.productRepository.insert(product, userId);
        // this.io.emit("products", { type: "create", data: newProduct });
        return newProduct;
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        return this.productRepository.insertBatch(products, userIds);
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        return this.productRepository.getAllProducts(page, itemsPerPage);
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        return this.productRepository.getAllProductsWithUsers(page, itemsPerPage);
    }

    public async getProductById(productId: string): Promise<Product | null> {
        return this.productRepository.getProductById(productId);
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        return this.productRepository.getProductWithUserById(productId);
    }

    public async deleteProductById(productId: string): Promise<void> {
        const success = await this.productRepository.deleteProductById(productId);

        if (!success) {
            throw new ProductNotFoundError();
        }
    }

    public async updateProductById(productId: string, product: Product): Promise<Product> {
        const updatedProduct = await this.productRepository.updateProductById(productId, product);

        if (!product) {
            throw new ProductNotFoundError();
        }

        return updatedProduct;
    }
}

export default ProductService;
