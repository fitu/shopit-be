import Product from "../domain/Product";

interface Repository {
    save: (product: Product, userId: number) => Promise<Product>;
    saveBulk: (products: Array<Product>, userIds: Array<number>) => Promise<Array<Product>>;
    getAllProducts: () => Promise<Array<Product>>;
    getProductById: (productId: number) => Promise<Product> | null;
    deleteProductById: (productId: number) => Promise<void>;
    updateProductById: (productId: number, product: Product) => Promise<Product> | null;
}

export type { Repository };
