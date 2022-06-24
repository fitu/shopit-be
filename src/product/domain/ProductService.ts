import { Server } from "socket.io";

import Page from "../../shared/Page";
import { NotFoundError } from "../../shared/error/NotFoundError";
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

    public async getProductById(productId: string): Promise<Product> {
        const product = await this.productRepository.getProductById(productId);

        if (!product) {
            // TODO: do not hardcode strings
            throw new NotFoundError("Product not found");
        }

        return product;
    }

    public async getProductWithUserById(productId: string): Promise<Product> {
        const product = await this.productRepository.getProductWithUserById(productId);

        if (!product) {
            // TODO: do not hardcode strings
            throw new NotFoundError("Product not found");
        }

        return product;
    }

    public async deleteProductById(productId: string): Promise<void> {
        const success = await this.productRepository.deleteProductById(productId);

        if (!success) {
            // TODO: do not hardcode strings
            throw new NotFoundError("Product not found");
        }
    }

    public async updateProductById(productId: string, product: Product): Promise<Product> {
        const updatedProduct = await this.productRepository.updateProductById(productId, product);

        if (!product) {
            // TODO: do not hardcode strings
            throw new NotFoundError("Product not found");
        }

        return updatedProduct;
    }
}

export default ProductService;
