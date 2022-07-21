import Page from "@shared/Page";
import Product from "@product/domain/Product";
import { Repository } from "@product/infrastructure/Repository";

class ProductRepository implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        return Promise.resolve(<Product>{});
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        return Promise.resolve([]);
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        return Promise.resolve(null);
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        return Promise.resolve(<Page<Array<Product>>>{});
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        return Promise.resolve(<Page<Array<Product>>>{});
    }

    public async getProductById(productId: string): Promise<Product | null> {
        return Promise.resolve(null);
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        return Promise.resolve(null);
    }
}

export default ProductRepository;
