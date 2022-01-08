import { Repository as ProductRepository } from "../infrastructure/Repository";

import Product from "./Product";

class ProductService {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    public async create(product: Product, userId: number): Promise<Product> {
        return this.productRepository.save(product, userId);
    }

    public async createBulk(products: Array<Product>, userIds: Array<number>): Promise<Array<Product>> {
        return this.productRepository.saveBulk(products, userIds);
    }

    public async getAllProducts(): Promise<Array<Product>> {
        return this.productRepository.getAllProducts();
    }

    public async getProductById(productId: number): Promise<Product> | null {
        return this.productRepository.getProductById(productId);
    }

    public async deleteProductById(productId: number): Promise<void> {
        return this.productRepository.deleteProductById(productId);
    }

    public async updateProductById(productId: number, product: Product): Promise<Product> | null {
        return this.productRepository.updateProductById(productId, product);
    }
}

export default ProductService;
