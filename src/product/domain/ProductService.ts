import { Server } from "socket.io";

import Page from "../../shared/Page";
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

    public async create(product: Product, userId: string): Promise<Product> {
        const newProduct = this.productRepository.create(product, userId);
        // this.io.emit("products", { type: "create", data: newProduct });
        return newProduct;
    }

    public async createBulk(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        return this.productRepository.createBulk(products, userIds);
    }

    public async getAllProducts(page?: number, itemsPerPage?: number): Promise<Page<Array<Product>>> {
        return this.productRepository.getAllProducts(page, itemsPerPage);
    }

    public async getProductById(productId: string): Promise<Product> {
        return this.productRepository.getProductById(productId);
    }

    public async deleteProductById(productId: string): Promise<void> {
        return this.productRepository.deleteProductById(productId);
    }

    public async updateProductById(productId: string, product: Product): Promise<Product> {
        return this.productRepository.updateProductById(productId, product);
    }
}

export default ProductService;
