import ProductRepository from "../infrastructure/ProductRepository";

import Product from "./Product";

class ProductService {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    public async create(product: Product, userId: number): Promise<Product> {
        return await this.productRepository.save(product, userId);
    }

    public async createBulk(products: Array<Product>, userIds: Array<number>): Promise<Array<Product>> {
        return await this.productRepository.saveBulk(products, userIds);
    }

    public async getAllProducts(): Promise<Array<Product>> {
        return await this.productRepository.getAllProducts();
    }

    public async getProductById(productId: number): Promise<Product> | null {
        return await this.productRepository.getProductById(productId);
    }

    public async deleteProductById(productId: number): Promise<void> {
        await this.productRepository.deleteProductById(productId);
    }

    public async updateProductById(productId: number, product: Product): Promise<Product> | null {
        return await this.productRepository.updateProductById(productId, product);
    }
}

export default ProductService;
