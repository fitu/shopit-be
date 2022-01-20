import Product from "../domain/Product";

interface Repository {
    save: (product: Product, userId: string) => Promise<Product>;
    saveBulk: (products: Array<Product>, userIds: Array<string>) => Promise<Array<Product>>;
    getAllProducts: () => Promise<Array<Product>>;
    getProductById: (productId: string) => Promise<Product>;
    deleteProductById: (productId: string) => Promise<void>;
    updateProductById: (productId: string, product: Product) => Promise<Product>;
}

export type { Repository };
