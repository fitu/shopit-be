import Page from "../../shared/Page";
import Product from "../domain/Product";

interface Repository {
    create: (product: Product, userId: string) => Promise<Product>;
    createBulk: (products: Array<Product>, userIds: Array<string>) => Promise<Array<Product>>;
    update: (product: Product, userId: string) => Promise<Product>;
    getAllProducts: (page: number, itemsPerPage: number) => Promise<Page<Array<Product>>>;
    getProductById: (productId: string) => Promise<Product | null>;
    deleteProductById: (productId: string) => Promise<void>;
    updateProductById: (productId: string, product: Product) => Promise<Product | null>;
}

export type { Repository };
