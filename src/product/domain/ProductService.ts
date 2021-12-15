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

    public async getAllProductsForUser(userId: number): Promise<Array<Product>> {
        const allProducts = await this.productRepository.getAllProductsForUser(userId);
        return allProducts;
    }
}

export default ProductService;
