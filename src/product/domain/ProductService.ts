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

    public create(product: Product, userId: number): Product {
        this.productRepository.save(product);
        this.userRepository.addProduct(userId, product.id);
        return product;
    }
}

export default ProductService;
