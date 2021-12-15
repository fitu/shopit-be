import UserRepository from "../../user/infrastructure/UserRepository";
import CartRepository from "../../cart/infrastructure/CartRepository";
import ProductRepository from "../../product/infrastructure/ProductRepository";

interface DatabaseOptions {
    force?: boolean;
}

interface Database {
    init: (options?: DatabaseOptions) => Promise<void>;
    clearDB: () => void;

    getUserRepository: () => UserRepository;
    getCartRepository: () => CartRepository;
    getProductRepository: () => ProductRepository;
}

export type { DatabaseOptions };
export default Database;
