import Page from "../../shared/Page";
import Product from "../domain/Product";

interface Repository {
    create: (product: Product, userId: string) => Promise<Product>;
    createBulk: (products: Array<Product>, userIds: Array<string>) => Promise<Array<Product>>;
    update: (product: Product, userId: string) => Promise<Product>;
    getAllProducts: (page?: number, itemsPerPage?: number) => Promise<Array<Product> | Page<Array<Product>>>;
    getProductById: (productId: string) => Promise<Product>;
    deleteProductById: (productId: string) => Promise<void>;
    updateProductById: (productId: string, product: Product) => Promise<Product>;
}

export type { Repository };
