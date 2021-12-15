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
        const allProducts = await this.productRepository.getAllProducts();
        return allProducts;
    }

    public async getProductById(productId: number): Promise<Product | null> {
        const product = await this.productRepository.getProductById(productId);
        return product;
    }
}

export default ProductService;
