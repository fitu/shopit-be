import UserRepository from "../../user/infrastructure/UserRepository";
import ProductRepository from "../infrastructure/ProductRepository";

import Product from "./Product";

class ProductService {
    private productRepository: ProductRepository;
    private userRepository: UserRepository;

    constructor(productRepository: ProductRepository, userRepository: UserRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public async create(product: Product, userId: number): Promise<Product> {
        const savedProduct = await this.productRepository.save(product);
        await this.userRepository.addProduct(userId, product.id);
        return savedProduct;
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
