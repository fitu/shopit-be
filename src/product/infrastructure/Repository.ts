import Page from "../../shared/Page";
import Product from "../domain/Product";

interface Repository {
    getAllProducts: (page: number, itemsPerPage: number) => Promise<Page<Array<Product>>>;
    getProductById: (productId: string) => Promise<Product | null>;
    getProductWithUserById: (productId: string) => Promise<Product | null>;
    insert: (product: Product, userId: string) => Promise<Product>;
    insertBatch: (products: Array<Product>, userIds: Array<string>) => Promise<Array<Product>>;
    updateProductById: (productId: string, product: Product) => Promise<Product | null>;
    deleteProductById: (productId: string) => Promise<boolean>;
}

export type { Repository };
